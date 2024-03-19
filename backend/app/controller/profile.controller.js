const db = require("../models"); 

// Models
const Profiles = db.Profiles;
const Trips = db.Trips;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

// Get profile
myWebsite.post("/get-profile", (req, res) => {
    
    var userID = req.body.userID;
    
    Profiles.findOne({userID:userID})
    .then((profile) => {

        if (profile) // profile exists
        {
            res.send(profile);
        }
        else
        {
            res.status(404).send({
                message: "User doesn't exist"
            })
        }
    })
});

// Get other's profile
myWebsite.post("/get-other-profile", (req, res) => {

    var username = req.body.username;
    var lowercase = username.toLowerCase();

    Profiles.findOne({lowercase:lowercase})
    .then((profile) => {

        if (profile) // profile exists
        {
            res.send(profile);
        }
        else
        {
            res.status(404).send({
                message: "User doesn't exist"
            })
        }
    })

})

// Edit profile
myWebsite.post("/edit-profile", async (req, res) => { 

    var userID = req.body.userID;

    await Profiles.findOne({userID:userID}).then(async (currProfile) => {

        if (currProfile.firstName !== req.body.firstName || 
            currProfile.lastName !== req.body.lastName) // Update name on postings
        {
            currProfile.firstName = req.body.firstName;
            currProfile.lastName = req.body.lastName;

            await Trips.updateMany({userID: userID}, {$set: {"name" : req.body.firstName + " " + req.body.lastName}}).then((trips) => {
                //console.log(trips);
            }).catch((e) => {
                console.log(e.message);
            })
        } 

        currProfile.age = req.body.age;
        currProfile.desc = req.body.desc;
        currProfile.gender = req.body.gender;
        currProfile.day = req.body.day;
        currProfile.month = req.body.month;
        currProfile.year = req.body.year;
        currProfile.profileImageData = req.body.profileImageData;
        currProfile.profileImageType = req.body.profileImageType;

        await currProfile.save().then(() => {
            console.log("success")
            res.send("success");
        }).catch((err) => {
            console.log(`DB Error: ${ex}`);
        })
    }).catch((e) => {
        console.log(e.message);
    })

});

module.exports = myWebsite