
var mongoose = require('mongoose');

const bodyParser = require('body-parser');
const user = require("../models/userModel");

const userGetHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllUsers(req, res, next);
  }
  else if (req.query.id) {
    getSpecificUser(req, res, next);
  }
  else if (req.query.email && req.query.password){
    checkEmailAndPassword(req,res,next);
    
  }
  
  
}

const userPostHandler = async(req,res,next) => {
  createUser(req, res, next);
}

const userPutHandler = async(req,res,next) => {
  updateUser(req,res,next);
}

const userDeleteHandler = async(req,res,next) => {
  deleteUser(req,res,next);
}


const  getAllUsers = async (req,res,next) => {
  try{
      const result = await user.find().lean()
      if ((result.length) > 0) {return res.json(result)}
      else {res.status(400)}
  } catch (err){
    return next(err)
  }
     
}



const  getSpecificUser = async (req,res,next) => {
  try{
  
    const result = await user.findById(req.query.id).lean()
    if (!result) {return res.status(400)}
     
    
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getSpecificUserItemCategory = async(req,res,next) => {
  try{
  
    const result = await user.findById(req.query.id).lean()
    if (!result) {return res.status(400)}
     
    
    return res.json(result.item_categories)
} catch (err){
    return next(err)
  }
}



const checkEmailAndPassword = async (req,res,next) => {
  try{
    const result = await user.find( {hashed_password: req.query.password, login_email: req.query.email}).lean()
    if (!result) {return res.status(400)}
 
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const createUser = async (req,res,next) => {
  try{
   
   
    
    const display_name = req.body.display_name
 
    const login_email = req.body.login_email
    const hashed_password = req.body.hashed_password
    const item_categories = req.body.item_categories
    const new_user = await user.create(
        {display_name: display_name,
        login_email: login_email,
        hashed_password: hashed_password,
        item_categories: item_categories
        
      }
    )
    if (!new_user) {return res.status(400)}
  
    return res.json(new_user)
} catch (err){
    return next(err)
  }
}

const updateUser = async (req,res,next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.body._id)
    const query = {_id: _id}
    const update = {}
    
    
    if (req.body.display_name) {
      update["display_name"] = req.body.display_name
    }
    if (req.body.login_email) {
      update["login_email"] = req.body.login_email
    }
    if (req.body.hashed_password) {
      update["hashed_password"] = req.body.hashed_password
    }
    if (req.body.new_category) {
      await user.findOneAndUpdate(query,{$addToSet:{"item_categories": req.body.new_category}},{returnDocument:'after'})
    }
    if (req.body.delete_category){
      await user.findOneAndUpdate(query,{$pull:{"item_categories": req.body.delete_category}},{returnDocument:'after'})
    }
    if (req.body.item_categories){
      update["item_categories"] = req.body.item_categories
    }

   
    const result = await user.findOneAndUpdate(query, update, {returnDocument:'after'});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return next(err)
  }
}


const deleteUser = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.query._id);
    const result = await user.deleteOne({_id: _id});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return next(err)
  }
}


module.exports = {
  userGetHandler,
  userPostHandler,
  userPutHandler,
  userDeleteHandler
}
