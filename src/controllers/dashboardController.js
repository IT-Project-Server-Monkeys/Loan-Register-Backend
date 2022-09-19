const loan = require('../models/loanModel')
const item = require('../models/itemModel')
const user = require('../models/userModel')
var mongoose = require('mongoose');

const dashboardGetHandler = async (req,res,next) => {
    user_id = new mongoose.Types.ObjectId((req.query.user_id).toString())

    const user_categories = (await user.find({_id: user_id}).lean())[0]['item_categories']

    const owned_items = await item.find({item_owner: user_id}).lean()
    
    const current_loans_to_user = await loan.find({loanee_id: user_id, status: "Current"}).lean()
    var current_item_ids = []
        
    current_loans_to_user.forEach((element) => {
        current_item_ids.push(element['item_id'])
    });

    var old_item_ids = []
    const old_loans_to_user = await loan.find({loanee_id: user_id, status: {$ne: "Current"} }).lean()
    console.log(old_loans_to_user)
    old_loans_to_user.forEach((element) => {
        old_item_ids.push(element['item_id'])
    })

    var items_for_old_loans = old_item_ids.filter(element => !current_item_ids.includes(element))
    var old_loans_to_parse = old_loans_to_user.filter(loan => items_for_old_loans.includes(loan['item_id']))

    var dashboard_objects = []
    for (const element of owned_items) {
        var new_object = {}
        new_object['user_role'] = "loaner";
        new_object['item_categories'] = user_categories;
        new_object['item_id'] = element['_id']

        new_object['item_name'] = element['item_name']
        new_object['category'] = element['category']
        new_object['description'] = element['description']
        new_object['being_loaned'] = element['being_loaned']
        new_object['loan_frequency'] = element['loan_frequency']
        if (element['image_url']) {
            new_object['image_url'] = element['image_url']
        }

        if (element['being_loaned'] == true) {
            var loan_details = (await loan.find({item_id: new mongoose.Types.ObjectId(element["_id"]), status: "Current"}).lean())[0]
            var loanee_name = (await user.find({_id: new mongoose.Types.ObjectId(loan_details['loanee_id'])}).lean())[0]
            new_object['loanee_id'] = loan_details['loanee_id']
            new_object['loanee_name'] = loanee_name['display_name']
            new_object['loan_start_date'] = loan_details['loan_start_date']
            new_object['intended_return_date'] = loan_details['intended_return_date']
            new_object['loan_status'] = "Current"
            if (loan_details['actual_return_date']) {
                new_object['actual_return_date'] = loan_details['actual_return_date']
            }
            else {
                new_object['actual_return_date'] = null
            }
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

    for (const element of current_loans_to_user) {
        var new_object = {}
        new_object['user_role'] = "loanee";
        new_object['item_categories'] = user_categories;
        new_object['item_id'] = element['item_id']
        var item_id = new mongoose.Types.ObjectId(element['item_id'])
        var item_details = (await item.find({_id: item_id}).lean())[0]
        var loaner_details = (await user.find({_id: new mongoose.Types.ObjectId(element['loaner_id'])}).lean())[0]
        new_object['item_name'] = item_details['item_name']
        new_object['category'] = item_details['category']
        new_object['description'] = item_details['description']
        new_object['being_loaned'] = item_details['being_loaned']
        new_object['loan_frequency'] = item_details['loan_frequency']
        if (item_details['image_url']) {
            new_object['image_url'] = item_details['image_url']
        }
        new_object['loaner_id'] = element['loaner_id']
        new_object['loaner_name'] = loaner_details['display_name']
        new_object['loan_start_date'] = element['loan_start_date']
        new_object['intended_return_date'] = element['intended_return_date']
        new_object['loan_status'] = 'Current'
        if (loan_details['actual_return_date']) {
            new_object['actual_return_date'] = element['actual_return_date']
        }
        else {
            new_object['actual_return_date'] = null
        }
    dashboard_objects.push(new_object)
    }

    for (const element of old_loans_to_parse) {
        var new_object = {}
        new_object['user_role'] = "loanee";
        new_object['item_categories'] = user_categories;
        new_object['item_id'] = element['item_id']
        var item_id = new mongoose.Types.ObjectId(element['item_id'])
        var item_details = (await item.find({_id: item_id}).lean())[0]
        var loaner_details = (await user.find({_id: new mongoose.Types.ObjectId(element['loaner_id'])}).lean())[0]
        new_object['item_name'] = item_details['item_name']
        new_object['category'] = item_details['category']
        new_object['description'] = item_details['description']
        new_object['being_loaned'] = item_details['being_loaned']
        new_object['loan_frequency'] = item_details['loan_frequency']
        if (item_details['image_url']) {
            new_object['image_url'] = item_details['image_url']
        }
        new_object['loaner_id'] = element['loaner_id']
        new_object['loaner_name'] = loaner_details['display_name']
        new_object['loan_start_date'] = element['loan_start_date']
        new_object['intended_return_date'] = element['intended_return_date']
        new_object['loan_status'] = element['status']
        if (element['actual_return_date']) {
            new_object['actual_return_date'] = element['actual_return_date']
        }
        else {
            new_object['actual_return_date'] = null
        }
        dashboard_objects.push(new_object)
    }
    return res.json(dashboard_objects)
}


module.exports= {
  dashboardGetHandler,
}
