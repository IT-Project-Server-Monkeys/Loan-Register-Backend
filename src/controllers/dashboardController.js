const loan = require('../models/loanModel')
const item = require('../models/itemModel')
const user = require('../models/userModel')
var mongoose = require('mongoose');

const dashboardGetHandler = async (req,res,next) => {
    user_id = new mongoose.Types.ObjectId((req.query.user_id).toString())
    const owned_items = await item.find({item_owner: user_id}).lean()
    
    const loans_to_user = await loan.find({loanee_id: user_id, status: "Current"}).lean()
    var dashboard_objects = []
    for (const element of owned_items) {
        var new_object = {}
        new_object['user_role'] = "loaner";
        new_object['item_name'] = element['item_name']
        new_object['category'] = element['category']
        new_object['description'] = element['description']
        new_object['being_loaned'] = element['being_loaned']
        new_object['loan_frequency'] = element['loan_frequency']
        if (element['being_loaned'] == true) {
            var loan_details = (await loan.find({item_id: new mongoose.Types.ObjectId(element["_id"]), status: "Current"}).lean())[0]
            var loanee_name = (await user.find({_id: new mongoose.Types.ObjectId(loan_details['loanee_id'])}).lean())[0]
            new_object['loanee_id'] = loan_details['loanee_id']
            new_object['loanee_name'] = loanee_name['display_name']
            new_object['loan_start_date'] = loan_details['loan_start_date']
            new_object['intended_return_date'] = loan_details['intended_return_date']
        }
        else {
            new_object['loanee_id'] = null
            new_object['loanee_name'] = null
            new_object['loan_start_date'] = null
            new_object['intended_return_date'] = null
        }     
        dashboard_objects.push(new_object)
    }

    for (const element of loans_to_user) {
        var new_object = {}
        new_object['user_role'] = "loanee";
        console.log("item_id", element['item_id'])
        var item_id = new mongoose.Types.ObjectId(element['item_id'])
        var item_details = (await item.find({_id: item_id}).lean())[0]
        console.log(item_details)
        var loaner_details = (await user.find({_id: new mongoose.Types.ObjectId(element['loaner_id'])}).lean())[0]
        new_object['item_name'] = item_details['item_name']
        new_object['category'] = item_details['category']
        new_object['description'] = item_details['description']
        new_object['being_loaned'] = item_details['being_loaned']
        new_object['loan_frequency'] = item_details['loan_frequency']
        new_object['loaner_id'] = element['loaner_id']
        new_object['loaner_name'] = loaner_details['display_name']
        new_object['loan_start_date'] = element['loan_start_date']
        new_object['intended_return_date'] = element['intended_return_date']
        dashboard_objects.push(new_object)
    }
    
    return res.json(dashboard_objects)
}

module.exports= {
  dashboardGetHandler
}
