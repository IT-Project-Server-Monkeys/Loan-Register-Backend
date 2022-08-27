
const item = require('../models/itemModel')
var mongoose = require('mongoose');


const itemHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllItems(req, res, next);
  }
  else if (req.query.id) {
    getSpecificItem(req, res, next);
  }
  else if (req.query.category) {
   
    getAllItemsbyCategory(req, res, next);
  }

  else if (req.query.item_owner) {
    getAllItemByItemOwner(req,res,next);
    
  }
 


}

const  getAllItems = async (req,res,next) => {
  try{
      const result = await item.find().lean()
      if ((result.length) > 0) {return res.json(result)}
      else {res.status(400)}
  } catch (err){
    return next(err)
  }
     
}

const  getSpecificItem = async (req,res,next) => {
  try{
    
    const result = await item.findById(req.query.id).lean()
    if (!result) {return res.status(400)}
    console.log(result.loan_frequency)
    return (res.json(result))
} catch (err){
    return next(err)
  }
}

const getAllItemsbyCategory = async (req,res,next) => {
  try{
    
    const result = await item.find({category: req.query.category}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllItemByItemOwner = async (req,res,next) => {
  try{
    item_owner = new mongoose.Types.ObjectId((req.query.item_owner).toString())
   
    const result = await item.find({item_owner: item_owner }).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}







module.exports= {
  itemHandler
}



