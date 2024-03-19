const db = require("../models"); 

// Models
const Accounts = db.Accounts;
const Sessions = db.Sessions;
const Profiles = db.Profiles;
const Statistics = db.Statistics;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

// Register an account
myWebsite.post("/register", async (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    var lowercase = username.toLowerCase();
    
    // Check if the username has already been used
    await Accounts.findOne({lowercase:lowercase}).then(async (account) =>{

        if (account) // Account already exists
        { 
            res.status(500).send({
                message: "The account already been created."
            })
        }
        else 
        {

            var currDate = new Date();
            const month = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

            var formattedDate = month[currDate.getMonth()] + " " + currDate.getDate() + ", " + currDate.getFullYear();

            var userID = uuidv4();

            var accountData = {
                username: username,
                password: password,
                userID: userID,
                lowercase: lowercase
            }

            var profileData = {
                firstName: "",
                lastName: "",
                age: -1,
                desc: "",
                gender: "",
                day: 1,
                month: 1,
                year: 2000,
                profileImageData: null,
                profileImageType: "",
                userID: userID,
                username: username,
                lowercase: lowercase
            }

            var statisticsData = {
                joined: formattedDate,
                tripDriver: 0,
                tripPassenger: 0,
                tripDistance: 0.0,
                passengerRating: -1.1,
                driverRating: -1.1,
                userID: userID
            }

            var newAccount = new Accounts(accountData);
            await newAccount.save().then(() => {
                console.log("New Account Created Successfully!");
                res.send("New Account Created Successfully!"); 
            }).catch((Ex) => {
                console.log(`Db Error: ${Ex.toString()}`);
                res.status(404).send({     
                    message: `Db Error: ${Ex.toString()}`
                })
            })

            var newProfiles = new Profiles(profileData);
            await newProfiles.save().then(() => {
                console.log("New profiles Created Successfully!");
            }).catch((Ex) => {
                console.log(`Db Error: ${Ex.toString()}`);
                res.status(404).send({    
                    message: `Db Error: ${Ex.toString()}`
                })
            })

            var newStatistics = new Statistics(statisticsData);
            await newStatistics.save().then(() => {
                console.log("New statistics saved successfully!");
            }).catch((Ex) => {
                console.log(`Db Error: ${Ex.toString()}`);
                res.status(404).send({    
                    message: `Db Error: ${Ex.toString()}`
                })
            })

        }
    })

});

// Login verification
myWebsite.post("/login", async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var lowercase = username.toLowerCase();

    console.log(`username:${username} & password:${password}`);

    // Check if 
    await Accounts.findOne({ lowercase: lowercase, password: password }).then(async (Account) => {
        console.log(`Accounts:${Account}`);
        
        if (Account) 
        {            
            await Sessions.findOne({ userID: Account.userID }).then(async (CurrSession) =>{

                // Session exists
                if (CurrSession) {
                    console.log(`Account haven't logout yet!`);
                    console.log(`Account session:${CurrSession}`);

                    // This lets you send an error, with error code 500 and custom message
                    res.status(500).send({
                        message: "Account haven't logout yet!."
                    })
                }
                else 
                {
                    const authKey = uuidv4();

                    var newInput = {
                        userID : Account.userID,
                        authKey: authKey
                    }

                    var newSession = new Sessions(newInput);
                    
                    newInput.username = Account.username; // Send username as well

                    await newSession.save().then(() => {
                        console.log("New session created Successfully!");
                        res.send(newInput); 
                    }).catch((Ex) => {
                        console.log(`Db Error: ${Ex.toString()}`);
                        res.status(404).send({    
                            message: `Db Error: ${Ex.toString()}`
                        })
                    })
                }
            })
        }
        else{
            console.log("No account found");
            res.status(500).send({                               
                message: "No account found"
            })        }
    }).catch((err) => {
        console.log(`Error: ${err}`);

        res.status(404).send({
            message: `Error: ${err}`
        })
    })
})

// Logout 
myWebsite.post("/logout", async (req, res) => {
    await Sessions.deleteMany({}).then((test) => {
        console.log("logout");
        res.send("success");
    }).catch((err) => {
        console.log(`Error: ${err}`);
    });
})

module.exports = myWebsite;
