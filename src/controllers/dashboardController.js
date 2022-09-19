const loan = require('../models/loanModel')
const item = require('../models/itemModel')
const user = require('../models/userModel')
var mongoose = require('mongoose');

const dashboardGetHandler = async (req,res,next) => {
    user_id = new mongoose.Types.ObjectId((req.query.user_id).toString())

    const user_categories = (await user.find({_id: user_id}).lean())[0]['item_categories']

    const owned_items = await item.find({item_owner: user_id}).lean()

    // now, need to get all loans to user, and get the items from them. Then, need to get unique list. 
    
    const all_loan_items = await loan.find({loanee_id:user_id}).sort({loan_start_date: -1}).lean()
    const unique_items = [...new Set (all_loan_items.map(element => {return element['item_id'].toString()}))];
    var recipient_loans = []
    unique_items.forEach( item => recipient_loans.push(all_loan_items.find(loan => loan['item_id'].toString() == item)))


    var dashboard_objects = []
    for (const element of owned_items) {
        var new_object = {}
        new_object['user_role'] = "loaner";
        new_object['item_categories'] = user_categories;
        new_object['item_id'] = element['_id']
        get_item_details(element, new_object)

        if (element['being_loaned'] == true) {
            item_id = new mongoose.Types.ObjectId(element["_id"]);
            var loan_details = (await loan.find({
                $and: [{$or: [{status: "On Loan"}, {status: "Overdue"}]},
                {item_id: item_id}]}).lean())[0]
            var loanee_name = (await user.find({_id: new mongoose.Types.ObjectId(loan_details['loanee_id'])}).lean())[0]
            get_loan_details(loan_details, new_object)
            new_object['loanee_name'] = loanee_name['display_name']
        }
        else {
            new_object['loanee_id'] = null
            new_object['loanee_name'] = null
            new_object['loan_start_date'] = null
            new_object['intended_return_date'] = null
            new_object['loan_status'] = null
            new_object['actual_return_date'] = null
        }     
        dashboard_objects.push(new_object)
    }
    for (const element of recipient_loans) {
        var new_object = {}
        new_object['user_role'] = "loanee";
        new_object['item_categories'] = user_categories;
        new_object['item_id'] = element['item_id']
        var item_id = new mongoose.Types.ObjectId(element['item_id'])
        var item_details = (await item.find({_id: item_id}).lean())[0]
        var loaner_details = (await user.find({_id: new mongoose.Types.ObjectId(element['loaner_id'])}).lean())[0]
        get_item_details(item_details, new_object)
        get_loan_details(element, new_object)
        new_object['loaner_name'] = loaner_details['display_name']
        dashboard_objects.push(new_object)
    }
    return res.json(dashboard_objects)
}

function get_item_details(item, new_object) {
    new_object['item_name'] = item['item_name']
    new_object['category'] = item['category']
    new_object['description'] = item['description']
    new_object['being_loaned'] = item['being_loaned']
    new_object['loan_frequency'] = item['loan_frequency']
    if (item['image_url']) {
        new_object['image_url'] = item['image_url']
    }
}

function get_loan_details(loan, new_object) {
    new_object['loaner_id'] = loan['loaner_id']
    new_object['loan_start_date'] = loan['loan_start_date']
    new_object['intended_return_date'] = loan['intended_return_date']
    new_object['loan_status'] = loan['status']
    if (loan['actual_return_date']) {
        new_object['actual_return_date'] = loan['actual_return_date']
    }
    else {
        new_object['actual_return_date'] = null
    }

}

module.exports= {
  dashboardGetHandler,
}
