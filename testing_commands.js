const {MongoClient, ObjectId} = require('mongodb');

const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

async function create_users() {
  MongoClient.connect(uri, function(err, db) {
    var dbo = db.db("ProjectDatabase");

    if (err) throw err;
    var user_1 = { display_name: "Test User 1", login_email: "test_user1@gmail.com", hashed_password: "thisisapassword" };
    var user_2 = { display_name: "Test User 2", login_email: "test_user3@gmail.com", hashed_password: "thisisapassword" };
    var user_3 = { display_name: "Test User 3", login_email: "test_user3@gmail.com", hashed_password: "thisisapassword" };
    var users = [user_1, user_2, user_3]
    dbo.collection("users").insertMany(users, function(err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    });
  });
}

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

function call_back(input) {
  console.log((input._id).toString())
}

async function main() {
  users = await get_users().catch(console.dir);
  test_owner = users[0]._id.toString()
  console.log(users)
}

async function create_item() {
  var result
  try {
    const database = client.db("ProjectDatabase");
    const items = database.collection("items");

    const doc = {
      item_name: "Harry Potter",
      category: "Book",
      description: "The Philosopher's Stone.",
      item_owner: ObjectId("62fd8a9df04410afbc6df31d"),
      being_loaned: false,
      loan_frequency: 0
    }

    result = await items.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
  return result._id
}

  

//create_users()
create_item()