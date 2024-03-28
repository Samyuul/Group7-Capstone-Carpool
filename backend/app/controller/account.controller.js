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
            res.status(403).send({
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
                profileImage: "",
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
            }).catch((Ex) => {
                res.status(500).send({     
                    message: `Db Error: ${Ex.toString()}`
                })
            })

            var newProfiles = new Profiles(profileData);
            await newProfiles.save().then(() => {
            }).catch((Ex) => {
                res.status(500).send({    
                    message: `Db Error: ${Ex.toString()}`
                })
            })

            var newStatistics = new Statistics(statisticsData);
            await newStatistics.save().then(() => {
            }).catch((Ex) => {
                res.status(500).send({    
                    message: `Db Error: ${Ex.toString()}`
                })
            })

            res.send("New Account Created Successfully!"); 

        }
    }).catch((e) => {
        res.status(500).send("Site currently down!");
    })

});

// Login verification
myWebsite.post("/login", async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var lowercase = username.toLowerCase();

    // Check if 
    await Accounts.findOne({ lowercase: lowercase, password: password }).then(async (Account) => {
        
        if (Account) 
        {            
            await Sessions.findOneAndDelete({ userID: Account.userID }).then(async (CurrSession) =>{

                // Generate new session
                const authKey = uuidv4();

                var newInput = {
                    userID : Account.userID,
                    authKey: authKey
                }

                var newSession = new Sessions(newInput);
                
                // Retrieve username
                newInput.username = Account.username; 

                // Retrieve profile image
                await Profiles.findOne({ userID: Account.userID })
                .then((profile) => {
                    newInput.profileImage = profile.profileImage;
                }).catch((err) => {
                    res.status(500).send({
                        message: `Error: ${err}`
                    })
                })

                await newSession.save().then(() => {
                    res.send(newInput); 
                }).catch((Ex) => {
                    res.status(500).send({    
                        message: `Db Error: ${Ex.toString()}`
                    })
                })

            })
        }
        else {
            res.status(404).send({                               
                message: "No account found"
            })        
        }
    }).catch((err) => {
        res.status(500).send({
            message: `Error: ${err}`
        })
    })
})

// Logout 
myWebsite.post("/logout", async (req, res) => {

    await Sessions.findOneAndDelete({ userID: req.body.userID })
    .then((test) => {}).catch((err) => {});

    res.send("success");

})

module.exports = myWebsite;
