const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ProjectDatabase");
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
  

