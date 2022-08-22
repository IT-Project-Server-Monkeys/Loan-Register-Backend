const PORT = process.env.PORT || 3000;

let express = require("express");
const recordRoutes = express.Router();
const { ObjectId } = require("mongodb");
let app = express();
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();
const collection = client.db("ProjectDatabase").collection("users");
const user = require("../models/userModel");
const  getAllUser = async (req,res,next) => {
  try{
      const result = await user.find().lean()
      return res.json(result)
  } catch (err){
    return next(err)
  }
     
}



const  getSpecificUser = async(req,res,next) => {
  try{
  user_id = new ObjectId(req.params.id)
  const result = await user.findById(user_id).lean()
  if (!result) {
    return res.status(404)
  }
  return res.json(result)
  } catch (err){
    return next(err)
  }
}



module.exports = {
  getAllUser,
  getSpecificUser
}
