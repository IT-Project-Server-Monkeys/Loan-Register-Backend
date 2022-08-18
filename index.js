const PORT = process.env.PORT || 3000;

let express = require("express");
const { ObjectId } = require("mongodb");
let app = express();
app.use(express.json());

let MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

app.get("/", (req, res) => {
    res.write("Hello, testing");
    res.send("IT Project Server Monkey Backend Initialisation")
});

app.get("/users", (req, res) => {
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProjectDatabase");
        dbo.collection("users").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
          db.close();
        });
    });
});

app.get("/users/:id", (req, res) => {
    user_id = new ObjectId((req.params.id).toString())
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProjectDatabase");
        dbo.collection("users").find({_id: user_id}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result)
            res.send(result);
            db.close();
        });
    });
});

app.listen(PORT, function() {
    console.log(`Listening on Port ${PORT}`);
});
