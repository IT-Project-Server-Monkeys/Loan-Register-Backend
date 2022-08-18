const PORT = process.env.PORT || 3000;

let express = require("express");
const { ObjectId } = require("mongodb");
let app = express();
app.use(express.json());

let MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

app.get("/", (req, res) => {
    res.send("IT Project Server Monkey Backend Initialisation")
});

app.get("/users", function(req, res) {
    users = get_users()
    res.send(users); //respond with the array of courses
});

app.get("/users/:id", function(req, res) {
    const user_id = (req.params.id);
    const user = get_individual_user(user_id)
    //if the course does not exist return status 404 (not found)
    if (!user)
        return res
            .status(404)
            .send("The user with the given id was not found");
    //return the object
    res.send(user);
});

app.listen(PORT, function() {
    console.log(`Listening on Port ${PORT}`);
});
  
async function get_users() {
    var allValues;
    try {
      const database = client.db("ProjectDatabase");
      const users = database.collection("users");
  
      const cursor = users.find();
  
      // print a message if no documents were found
      if ((await cursor.countDocuments) == 0) {
        console.log("No documents found!");
      }
      // replace console.dir with your callback to access individual elements
      allValues = await cursor.toArray();
    } finally {
      await client.close();
    }
    return allValues
  
  }

async function get_individual_user(user_id) {
    var user;
    try {
        const database = client.db("ProjectDatabase");
        const users = database.collection("users");
    // Query for a movie that has the title 'The Room'
        const query = { id: new ObjectId(user_id)};
        const options = {
        };
        const user = await users.findOne(query, options);
        // since this method returns the matched document, not a cursor, print it directly
    } finally {
        await client.close();
    }
    return user;
}
