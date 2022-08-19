const PORT = process.env.PORT || 3000;

let express = require("express");
const recordRoutes = express.Router();
const { ObjectId } = require("mongodb");
let app = express();
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use('/', recordRoutes);

app.get("/", (req, res) => {
    res.send("hello,testing");
});

recordRoutes.route("/users").get(async function (req, res) {
    const collection = client.db("ProjectDatabase").collection("users");
    collection.find({}).limit(50).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(err)
        } else {
          res.json(result);
        }
      });
  });
  /*
app.get("/users", (req, res) => {
    client.connect(err => {
        const collection = client.db("ProjectDatabase").collection("users");
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
        // perform actions on the collection object
    });
});*/


app.get("/tester", (req, res) => {
    res.send("Testing Get command")
});

app.get("/items", (req, res) => {
    client.connect(err => {
        const collection = client.db("ProjectDatabase").collection("items");
        collection.find({}).toArray(function(err, result) {
            if (err) {
                res.status(400).json(err)
            } 
            else{
                res.json(result);
            }
        });
        // perform actions on the collection object
    });
});

app.get("/users/:id", (req, res) => {
    user_id = new ObjectId((req.params.id).toString())
    client.connect(err => {
        const collection = client.db("ProjectDatabase").collection("users");
        collection.find({_id: user_id}).toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
        // perform actions on the collection object
    });
});

app.listen(PORT, function() {
    console.log(`Listening on Port ${PORT}`);
});
