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
      getAllLoansbyLoanerandStatus(req,res,next)
    }
    else {getAllLoansbyLoaner(req, res, next);}
  }

  else if (req.query.loanee_id) {
    if (req.query.status){
      getAllLoansbyLoaneeandStatus(req,res,next)
    }
    else {getAllLoansbyLoanee(req, res, next);}
  }

  else if (req.query.item_id) {
    if (req.query.status) {
      getAllLoansbyItemandStatus(req,res,next)
    }
    getAllLoansbyItem(req, res, next)
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
    return next(err)
  }
     
}

const  getSpecificLoan = async (req,res,next) => {
  try{
    loan_id = new mongoose.Types.ObjectId((req.query._id).toString())
    const result = await loan.find({_id: loan_id}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllLoansbyLoaner = async (req,res,next) => {
  try{
    loaner_id = new mongoose.Types.ObjectId((req.query.loaner_id).toString())
    const result = await loan.find({loaner_id: loaner_id}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllLoansbyLoanerandStatus = async (req,res,next) => {
  try{
    loaner_id = new mongoose.Types.ObjectId((req.query.loaner_id).toString())
    const status = getStatus(req)
    const result = await loan.find({loaner_id: loaner_id, status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllLoansbyLoanee = async (req,res,next) => {
  try{
    loanee_id = new mongoose.Types.ObjectId((req.query.loanee_id).toString())
    const result = await loan.find({loanee_id: loanee_id}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllLoansbyLoaneeandStatus = async (req,res,next) => {
  try{
    loanee_id = new mongoose.Types.ObjectId((req.query.loanee_id).toString())
    const status = getStatus(req)
    const result = await loan.find({loanee_id: loanee_id, status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllLoansbyItemandStatus = async (req,res,next) => {
  try {
    item_id = new mongoose.Types.ObjectId((req.query.item_id).toString())
    const status = getStatus(req)
    const result = await loan.find({item_id: item_id, status:status}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

const getAllLoansbyItem = async (req,res,next) => {
  try{
    item_id = new mongoose.Types.ObjectId((req.query.item_id).toString())
    const result = await loan.find({item_id: item_id}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const createLoan = async (req,res,next) => {
  try{
    const loaner_id = new mongoose.Types.ObjectId(req.body.loaner_id);
    const loanee_id = new mongoose.Types.ObjectId(req.body.loanee_id);
    const item_id = new mongoose.Types.ObjectId(req.body.item_id);
    const status = (req.body.status).toString()
    const loan_start_date = new Date(req.body.loan_start_date.toString())
    const intended_return_date = new Date(req.body.intended_return_date.toString())
    const loan_result = await loan.create(
        {loaner_id: loaner_id,
        loanee_id: loanee_id,
        item_id: item_id,
        status: status,
        loan_start_date: loan_start_date,
        intended_return_date: intended_return_date,
      }
    )
    if (!loan_result) {return res.status(400)}
    const item_result = await item.findOneAndUpdate({_id: item_id}, {$inc : {'loan_frequency' : 1}, $set : {'being_loaned': true}})
    if (!item_result) {return res.status(400)}
    return res.json({loan_result: loan_result, item_result: item_result})
} catch (err){
    return next(err)
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
    if (req.body.status) {
      update["status"] = req.body.status
      if (req.body.status != "Current") {
        console.log("Getting loan details")
        const loan_details = await loan.find({_id: _id}).lean()
        console.log(loan_details)
        const item_id = loan_details[0]["item_id"]
        console.log(item_id)
        const item_result = await item.findOneAndUpdate({_id: item_id}, {$set : {'being_loaned': false}})
        if (!item_result) {return res.status(400)}
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

    const result = await loan.findOneAndUpdate(query, update, {returnDocument:'after'});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return next(err)
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
    return next(err)
  }
}

function getStatus(req) {
  var status;
  if (req.query.status.toString()=="current") {
    status = "Current"
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
  return status;
}


module.exports= {
  loanGetHandler,
  loanPostHandler,
  loanPutHandler,
  loanDeleteHandler
}
