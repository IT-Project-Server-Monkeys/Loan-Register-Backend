
const item = require('../models/itemModel')
const loan = require('../models/loanModel')
const user = require("../models/userModel");
var mongoose = require('mongoose');


const itemGetHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllItems(req, res, next);
  }
  else if (req.query._id) {
    getSpecificItem(req, res, next);
  }
  else if (req.query.category) {
   
    getAllItemsbyCategory(req, res, next);
  }

  else if (req.query.item_owner) {
    getAllItemByItemOwner(req,res,next);
    
  }
  
  
 


}

const itemPostHandler = async(req,res,next) => {
  createItem(req,res,next)
}

const itemPutHandler = async(req,res,next) => {
  editItem(req,res,next)
}
const itemDeleteHandler = async(req,res,next) => {
  deleteItem(req,res,next)
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
    
    const result = await item.findById(req.query._id).lean()
    if (!result) {return res.status(400)}
    
    return (res.json(result))
} catch (err){
    return next(err)
  }
}

const getItemLoanFrequency = async(req,res,next) => {
  try{
    const result = await item.findById(req.query._id).lean()
    if (!result) {return res.status(400)}
    return res.json(result.loan_frequency)
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


const createItem = async (req,res,next) => {
  try{
    const item_name =req.body.item_name;
    const category =req.body.category;
    const description = req.body.description;
    const item_owner = new mongoose.Types.ObjectId(req.body.item_owner);
    
   
    const item_result = await item.create(
        {item_name: item_name,
        category: category,
        description: description,
        item_owner: item_owner,
        being_loaned: false,
        loan_frequency: 0
       
        
      }
    )
  
    if (!item_result) {return res.status(400)}
    return res.json(item_result)
} catch (err){
    return next(err)
  }
}

const editItem = async (req,res,next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.body._id)
    const query = {_id: _id}
    const update = {}
    
    if (req.body.item_name) {
      update["item_name"] = req.body.item_name
    }
    if (req.body.category) {
      update["category"] = req.body.category
    }
    if (req.body.description) {
      update["description"] = req.body.description
    }
    if (req.body.item_owner) {
      update["item_owner"] = new mongoose.Types.ObjectId(req.body.item_owner)
    }

    if (req.body.being_loaned) {
      update["being_loaned"] = req.body.being_loaned
    }

    const result = await item.findOneAndUpdate(query, update, {returnDocument:'after'});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return next(err)
  }
}






const deleteItem = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.query._id);
    const loan_associated = await loan.find({item_id:_id}).lean();
    if (!loan_associated){
      const delete_result = await item.deleteOne({_id: _id});
    if (!delete_result) {return res.status(400)}
    return res.json(delete_result)

    }else{
      return res.status(400).json({message: "Item is currently being loaned and cannot be deleted"})

    }
   
  }
  catch (err){
    return next(err)
  }
}









module.exports= {
  itemGetHandler,
  itemPostHandler,
  itemPutHandler,
  itemDeleteHandler,
}



