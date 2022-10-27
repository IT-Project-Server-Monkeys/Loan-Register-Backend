const loan = require('../models/loanModel')
const item = require('../models/itemModel')
const user = require('../models/userModel')
var mongoose = require('mongoose');

const dashboardGetHandler = async (req,res,next) => {
    const userId = new mongoose.Types.ObjectId((req.query.user_id).toString())

    const userCategories = (await user.find({_id: userId}).lean())[0]['item_categories']


    const loanedItems = await loan.find({loaner_id:userId, status:"On Loan"}).lean()
    const borrowedItems =  await loan.find({loanee_id:userId,status: "On Loan"}).lean()

    const total = loanedItems.concat(borrowedItems)
    console.log(total)
    await fixOverDues(total)
    const ownedItems = await item.find({item_owner: userId}).lean()    
    const allLoanItems = await loan.find({loanee_id:userId}).sort({loan_start_date: -1}).lean()
    const uniqueItems = [...new Set (allLoanItems.map(element => {return element['item_id'].toString()}))];
    var recipientLoans = []
    uniqueItems.forEach( item => recipientLoans.push(allLoanItems.find(loan => loan['item_id'].toString() == item)))


    // check recipient loans to make sure they're the correct time!

    var dashboardObjects = []
    for (const element of ownedItems) {
        var newObject = {}
        newObject['user_role'] = "loaner";
        newObject['item_categories'] = userCategories;
        newObject['item_id'] = element['_id']
        getItemDetails(element, newObject)

        if (element['being_loaned'] == true) {
            itemId = new mongoose.Types.ObjectId(element["_id"]);
            var loanDetails = (await loan.find({
                $and: [{$or: [{status: "On Loan"}, {status: "Overdue"}]},
                {item_id: itemId}]}).lean())[0]
            var loaneeName = (await user.find({_id: new mongoose.Types.ObjectId(loanDetails['loanee_id'])}).lean())[0]
            getLoanDetails(loanDetails, newObject)
            newObject['loanee_name'] = loaneeName['display_name']
        }
        else {
            newObject['loanee_id'] = null
            newObject['loanee_name'] = null
            newObject['loan_start_date'] = null
            newObject['intended_return_date'] = null
            newObject['loan_status'] = "Available"
            newObject['actual_return_date'] = null
        }     
        dashboardObjects.push(newObject)
    }
    for (const element of recipientLoans) {
        var newObject = {}
        newObject['user_role'] = "loanee";
        newObject['item_categories'] = userCategories;
        newObject['item_id'] = element['item_id']
        var itemId = new mongoose.Types.ObjectId(element['item_id'])
        var itemDetails = (await item.find({_id: itemId}).lean())[0]
        var loanerDetails = (await user.find({_id: new mongoose.Types.ObjectId(element['loaner_id'])}).lean())[0]
        getItemDetails(itemDetails, newObject)
        getLoanDetails(element, newObject)
        newObject['loaner_name'] = loanerDetails['display_name']
        dashboardObjects.push(newObject)
    }
    return res.json(dashboardObjects)
}

function getItemDetails(item, newObject) {
    newObject['item_name'] = item['item_name']
    newObject['item_owner'] = item['item_owner']
    newObject['category'] = item['category']
    newObject['description'] = item['description']
    newObject['being_loaned'] = item['being_loaned']
    newObject['loan_frequency'] = item['loan_frequency']
    if (item['image_url']) {
        newObject['image_url'] = item['image_url']
    }
    newObject['visible'] = item['visible']
}

function getLoanDetails(loan, newObject) {
    newObject['loaner_id'] = loan['loaner_id']
    newObject['loan_start_date'] = loan['loan_start_date']
    newObject['intended_return_date'] = loan['intended_return_date']
    newObject['loan_status'] = loan['status']
    if (loan['actual_return_date']) {
        newObject['actual_return_date'] = loan['actual_return_date']
    }
    else {
        newObject['actual_return_date'] = null
    }

}
function checkOverdue(loan) {
    const return_date = loan['intended_return_date']
    const todays_date = new Date()
    console.log(todays_date)
    const diffTime = (todays_date - return_date);
    console.log(diffTime)
    return diffTime > 0;
}

async function fixOverDues(loans) {
    for (const element of loans) {
        if (checkOverdue(element)) {
            console.log("Overdue! Fix")
            try {
                const result = await loan.findOneAndUpdate({_id: element['_id']}, {status: "Overdue"}, {returnDocument:'after'});
                console.log("Fixed!")
            }
            catch {
                console.log("Did not update successfully...")
            }
        }
    }
}

module.exports= {
  dashboardGetHandler,
}
