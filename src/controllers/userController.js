
var mongoose = require('mongoose');


const user = require("../models/userModel");

const userHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllUsers(req, res, next);
  }
  else if (req.query.id) {
    getSpecificUser(req, res, next);
  }
  
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
    user_id = new mongoose.Types.ObjectId((req.query.id).toString())
    const result = await user.find({_id: user_id}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}


module.exports = {
  userHandler
}
