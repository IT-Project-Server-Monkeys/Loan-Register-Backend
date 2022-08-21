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
const collection = client.db("ProjectDatabase").collection("items");
