const {MongoClient} = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://phoebe_bear:GoldenDragon1@comp30022-project.yybkyjm.mongodb.net/?retryWrites=true&w=majority"
 

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ProjectDatabase");
            dbo.createCollection("users", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["display_name", "login_email", "hashed_password"],
                        properties: {
                            display_name: {
                            bsonType: "string",
                            description: "Display name, for both internal and external use - is required."
                            },
                            login_email: {
                                bsonType: "string",
                                description: "Email (username), is required."
                            },
                            hashed_password: {
                                bsonType: "string",
                                description: "HASHED password of user - required for log in."
                            }
                        }
                    }
                }
                }, function(err, res) {
              if (err) throw err;
              console.log("Collection created!");
            });

            dbo.createCollection("items", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["item_name", "category", "description", "item_owner", "being_loaned", "loan_frequency"],
                        properties: {
                            item_name: {
                            bsonType: "string",
                            description: "Item name, user to input."
                            },
                            category: {
                                enum: ["Electronics", "Books", "Stationary", "University Resources", "Cash", "Miscellaneous", "Personal", "Clothing and Apparel", "Toiletries and Beauty"],
                                description: "Item must be one of these types."
                            },
                            description: {
                                bsonType: "string",
                                description: "Must be a string and is required. Can be empty string."
                            },
                            item_owner: {
                                bsonType: "objectId",
                                description: "A link to the owner of the item - required."
                            },
                            on_loan: {
                                bsonType: "bool",
                                description: "Boolean, whether or not item is currently on loan."
                            },
                            loan_count: {
                                bsonType: "int",
                                description: "Number of times item has been loaned out."
                            }

                        }
                    }
                }
                }, function(err, res) {
              if (err) throw err;
              console.log("Collection created!");
            });

            dbo.createCollection("loans", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["loaner_id", "loanee_id", "item_id", "status", "loan_start_date", "intended_return_date", "actual_return_date"],
                        properties: {
                            loaner_id: {
                                bsonType: "objectId",
                                description: "The Mongodb ID for the loaner user."
                            },
                            loanee_id: {
                                bsonType: "objectId",
                                description: "The Mongodb ID for the loanee user."
                            },
                            item_id: {
                                bsonType: "objectId",
                                description: "The Mongodb ID for the item."
                            },
                            status: {
                                enum: ["Current", "On Time Return", "Late Return", "Early Return"],
                                description: "Loan status, can only be one of these enum values."
                            },
                            loan_start_date: {
                                bsonType: "date",
                                description: "Start date."
                            },
                            intended_return_date: {
                                bsonType: "date",
                                description: "Desired end date."
                            },
                            actual_return_date: {
                                bsonType: "date",
                                description: "Actual end date."
                            }
                        }
                    }
                }
                }, function(err, res) {
              if (err) throw err;
              console.log("Collection created!");
            });

        });        
     
    } finally {
        await client.close();
    }
}

main().catch(console.error);


