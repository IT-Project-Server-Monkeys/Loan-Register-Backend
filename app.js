let express = require("express");
let app = express();

let MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

app.listen(process.env.PORT||3000, () => console.log("Server running on port 3000!"))

app.get("/:name", (req, res) => {
    res.send("Your name is " + req.params.name + "\n");

});

app.use(express.json());

app.post('/', (req, res) => {
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProjectDatabase");
        dbo.collection(req.body.collection).insertOne({
            display_name: req.body.display_name,
            login_email: req.body.login_email,
            hashed_password: req.body.hashed_password
        },
        function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});
module.exports = app;
