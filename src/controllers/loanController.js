const loan = require('../models/loanModel')
const item = require('../models/itemModel')
var mongoose = require('mongoose');

const loanGetHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllLoans(req, res, next);
  }
  else if (req.query.id) {
    getSpecificLoan(req, res, next);
  }
  else if (req.query.loaner_id) {
    if (req.query.status){
      if (req.query.status == "current") {
        getAllCurrentLoansbyLoaner(req,res,next);
      }
      else {
        getAllLoansbyLoanerandStatus(req,res,next);
      }
    }
    else {getAllLoansbyLoaner(req, res, next);}
  }
  else if (req.query.loanee_id) {
    if (req.query.status){
      if (req.query.status == "current") {
        getAllCurrentLoansbyLoanee(req,res,next);
      }
      else {
        getAllLoansbyLoaneeandStatus(req,res,next)
      }
    }
    else {getAllLoansbyLoanee(req, res, next);}
  }

  else if (req.query.item_id) {
    if (req.query.status) {
      if (req.query.status == "current") {
        getAllCurrentLoansbyItem(req,res,next);
      }
      else {
        getAllLoansbyItemandStatus(req,res,next);
      }
    }
    else {
      getAllLoansbyItem(req, res, next)
    }
  }

  else if (req.query.status) {
    if (req.query.status == "current") {
      getAllCurrentLoans(req,res,next);
    }
    else {getAllLoansbyStatus(req,res,next);}
  }
}

const loanPostHandler = async (req, res, next) => {
  createLoan(req,res,next);
}

const loanPutHandler = async (req, res, next) => {
  editLoan(req,res,next)
}

const loanDeleteHandler = async (req, res, next) => {
  deleteLoan(req, res, next)
}


const  getAllLoans = async (req,res,next) => {
  try{
      const result = await loan.find().lean()
      if ((result.length) > 0) {return res.json(result)}
      else {res.status(400)}
  } catch (err){
    return res.status(400)
  }
     
}

const  getSpecificLoan = async (req,res,next) => {
  try{
    const loanId = new mongoose.Types.ObjectId((req.query._id).toString())
    const result = await loan.find({_id: loanId}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllLoansbyLoaner = async (req,res,next) => {
  try{
    const loanerId = new mongoose.Types.ObjectId((req.query.loaner_id).toString())
    const result = await loan.find({loaner_id: loanerId}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllLoansbyLoanerandStatus = async (req,res,next) => {
  try{
    const loanerId = new mongoose.Types.ObjectId((req.query.loaner_id).toString())
    const status = getStatus(req)
    const result = await loan.find({loaner_id: loanerId, status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllLoansbyLoanee = async (req,res,next) => {
  try{
    const loaneeId = new mongoose.Types.ObjectId((req.query.loanee_id).toString())
    const result = await loan.find({loanee_id: loaneeId}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllLoansbyLoaneeandStatus = async (req,res,next) => {
  try{
    const loaneeId = new mongoose.Types.ObjectId((req.query.loanee_id).toString())
    const status = getStatus(req)
    const result = await loan.find({loanee_id: loaneeId, status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllLoansbyItemandStatus = async (req,res,next) => {
  try {
    const itemId = new mongoose.Types.ObjectId((req.query.item_id).toString())
    const status = getStatus(req)
    const result = await loan.find({item_id: itemId, status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
  } catch (err) {
    return res.status(400)
  }
}

const getAllLoansbyItem = async (req,res,next) => {
  try{
    const itemId = new mongoose.Types.ObjectId((req.query.item_id).toString())
    const result = await loan.find({item_id: itemId}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const createLoan = async (req,res,next) => {
  try{   
    const loanerId = new mongoose.Types.ObjectId(req.body.loaner_id);
    const loaneeId = new mongoose.Types.ObjectId(req.body.loanee_id);
    const itemId = new mongoose.Types.ObjectId(req.body.item_id);
    const currentLoansExist = await checkCurrentLoans(itemId);
    if (currentLoansExist) {return res.status(400)}
    const status = (req.body.status).toString()
    const loanStartDate = new Date(req.body.loan_start_date.toString())
    const intendedReturnDate = new Date(req.body.intended_return_date.toString())
    const loaneeName = req.body.loanee_name ? (req.body.loanee_name).toString() : ''
    const itemImage = req.body.item_image ? (req.body.item_image).toString() : ''
    
    const loanResult = await loan.create(
        {loaner_id: loanerId,
        loanee_id: loaneeId,
        item_id: itemId,
        status: status,
        loan_start_date: loanStartDate,
        intended_return_date: intendedReturnDate,
        loanee_name: loaneeName,
        item_image: itemImage
      }
    )
    if (!loanResult) {return res.status(400)}
    const itemResult = await item.findOneAndUpdate({_id: itemId}, {$inc : {'loan_frequency' : 1}, $set : {'being_loaned': true}})
    if (!itemResult) {return res.status(400)}
    return res.json(loanResult)
} catch (err){
    return res.status(400)
  }
}

const editLoan = async (req,res,next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.body._id)
    const query = {_id: _id}
    const update = {}
    
    if (req.body.loanee_id) {
      update["loanee_id"] = new mongoose.Types.ObjectId(req.body.loanee_id)
    }
    if (req.body.loanee_name) {
      update["loanee_name"] = req.body.loanee_name;
    }
    if (req.body.status) {
      update["status"] = req.body.status
      if (req.body.status.includes("Return")) {
        const loanDetails = await loan.find({_id: _id}).lean()
        const itemId = loanDetails[0]["item_id"]
        const itemResult = await item.findOneAndUpdate({_id: itemId}, {$set : {'being_loaned': false}})
        if (!itemResult) {return res.status(400)}
      }
    }
    if (req.body.loan_start_date) {
      update["loan_start_date"] = new Date(req.body.loan_start_date)
    }
    if (req.body.intended_return_date) {
      update["intended_return_date"] = new Date(req.body.intended_return_date)
    }

    if (req.body.actual_return_date) {
      update["actual_return_date"] = new Date(req.body.actual_return_date)
    }
    if (req.body.item_image) {
      update['item_image'] = req.body.item_image
    }

    const result = await loan.findOneAndUpdate(query, update, {returnDocument:'after'});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return res.status(400)
  }
}

const deleteLoan = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.query._id);
    const result = await loan.deleteOne({_id: _id});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return res.status(400)
  }
}

function getStatus(req) {
  var status;
  if (req.query.status.toString()=="on_loan") {
    status = "On Loan"
  }
  if (req.query.status.toString()=="late_return") {
    status = "Late Return"
  }
  if (req.query.status.toString()=="early_return") {
    status = "Early Return"
  }
  if (req.query.status.toString()=="on_time_return") {
    status = "On Time Return"
  }
  if (req.query.status.toString()=="overdue") {
    status = "Overdue"
  }
  return status;
}

const getAllLoansbyStatus = async (req,res,next) => {
  try {
    const status = getStatus(req)
    const result = await loan.find({status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
  } catch (err) {
    return res.status(400)
  }
}

const checkCurrentLoans = async (itemId) => {
  try {
    const result = await loan.find({
      $and: [{$or: [{status: "On Loan"}, {status: "Overdue"}]},
      {item_id: itemId}]}).lean()
    return (result.length>1)  
  }
  catch (err) {
    return false
  }
}

const getAllCurrentLoansbyLoaner = async (req,res,next) => {
  try{
    loanerId = new mongoose.Types.ObjectId((req.query.loaner_id).toString())
    const result = await loan.find({
      $and: [{$or: [{status: "On Loan"}, {status: "Overdue"}]},
      {loaner_id: loanerId}]}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllCurrentLoansbyLoanee = async (req,res,next) => {
  try{
    loaneeId = new mongoose.Types.ObjectId((req.query.loanee_id).toString())
    const result = await loan.find({
      $and: [{$or: [{status: "On Loan"}, {status: "Overdue"}]},
      {loanee_id: loaneeId}]}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllCurrentLoansbyItem = async (req,res,next) => {
  try{
    itemId = new mongoose.Types.ObjectId((req.query.item_id).toString())
    const result = await loan.find({
      $and: [{$or: [{status: "On Loan"}, {status: "Overdue"}]},
      {item_id: itemId}]}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}

const getAllCurrentLoans = async (req,res,next) => {
  try{
    const result = await loan.find({$or: [{status: "On Loan"}, {status: "Overdue"}]}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return res.status(400)
  }
}


module.exports= {
  loanGetHandler,
  loanPostHandler,
  loanPutHandler,
  loanDeleteHandler
}
