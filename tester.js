const PORT = 3000//process.env.PORT || 3000;

let express = require("express");
const recordRoutes = express.Router();
const { ObjectId } = require("mongodb");
let app = express();
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.use('/', recordRoutes);

app.get("/", (req, res) => {
    res.send("Server Monkeys Backend Testing");
});
require('./src/models')
recordRoutes.route("/users").get(async function (req, res) {
    const collection = client.db("ProjectDatabase").collection("users");
    collection.find({}).limit(50).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(err);
        } else {
          res.json(result);
          return;
        }
    });
});

recordRoutes.route("/items").get(async function (req, res) {
    const collection = client.db("ProjectDatabase").collection("items");
    collection.find({}).limit(50).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(err)
        } else {
          res.json(result);
        }
    });
});


recordRoutes.route("/users:id").get(async function (req, res) {
    user_id = new ObjectId((req.query.id).toString())
    const collection = client.db("ProjectDatabase").collection("users");
    collection.find({_id: user_id}).limit(50).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(err);
        } else {
          res.json(result);
        }
    });
});

recordRoutes.route("/loans").get(async function (req, res) {
    const collection = client.db("ProjectDatabase").collection("loans");
    collection.find({}).limit(50).toArray(function (err, result) {
        if (err) {
            res.status(400).send("Error fetching listings!");
        } else {
            res.json(result);
        }
        });
});


recordRoutes.route("/users/add").post(function (req, res) {
    const collection = client.db("ProjectDatabase").collection("users");
    collection.find({display_name: req.body.display_name}).toArray(function (err, result) {
      if (err) {
          return res.status(400).send("Error fetching listings!");
      }
      else {
        if (result.length > 0) {
          console.log("line 79")
          return res.status(400).send("Not a unique display name.\n");
        }
        else {
          let myobj = {
            display_name: req.body.display_name,
            login_email: req.body.login_email,
            hashed_password: req.body.hashed_password,
          };
          collection.insertOne(myobj, function (err, result) {
            if (err) {
              console.log(err);
            }
            return res.json(result);
          });
        }
      }
    });
});

// add in function to check for unique usernames

async function check_unique_name(name) {
  const collection = client.db("ProjectDatabase").collection("users");
  const cursor = collection.find({display_name: name});
  return (cursor.countDocuments==0)
}

app.listen(PORT, function() {
    console.log(`Listening on Port ${PORT}`);
});
