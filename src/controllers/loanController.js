const loan = require('../models/loanModel')
var mongoose = require('mongoose');

const loanHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllLoans(req, res, next);
  }
  else if (req.query.id) {
    getSpecificLoan(req, res, next);
  }
  else if (req.query.loaner_id) {
    if (req.query.status && req.query.status.toString()=="current"){
      getAllCurrentLoansbyLoaner(req,res,next)
    }
    else {getAllLoansbyLoaner(req, res, next);}
  }

  else if (req.query.loanee_id) {
    if (req.query.status && req.query.status.toString()=="current"){
      getAllCurrentLoansbyLoanee(req,res,next)
    }
    else {getAllLoansbyLoanee(req, res, next);}
  }

  else if (req.query.item_id) {
    getAllLoansbyItem(req, res, next)
  }

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
    loan_id = new mongoose.Types.ObjectId((req.query.id).toString())
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

const getAllCurrentLoansbyLoaner = async (req,res,next) => {
  try{
    loaner_id = new mongoose.Types.ObjectId((req.query.loaner_id).toString())
    const result = await loan.find({loaner_id: loaner_id, status:"Current"}).lean()
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

const getAllCurrentLoansbyLoanee = async (req,res,next) => {
  try{
    loanee_id = new mongoose.Types.ObjectId((req.query.loanee_id).toString())
    const result = await loan.find({loanee_id: loanee_id, status:"Current"}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
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

module.exports= {
  loanHandler
}
