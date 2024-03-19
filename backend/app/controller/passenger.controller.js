const db = require("../models"); 

// Models
const Passengers = db.Passengers;
const Trips = db.Trips;
const Profiles = db.Profiles;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

// Join a trip as a passenger
myWebsite.post("/join-trip", (req, res) => {

    Passengers.findOne({tripID: req.body.tripID}).then(async (trip) => {

        if (!trip.passengerID.includes(req.body.passengerID)) // Haven't join already
        {

            // Get full name 
            Profiles.findOne({userID: req.body.passengerID})
            .then(async (profile) => {

                var fullName = profile.firstName + " " + profile.lastName;

                trip.passengerID.push(req.body.passengerID);
                trip.passengerUsername.push(req.body.passengerUsername);
                trip.passengerName.push(fullName);
    
                await trip.save().then(() => {
                    console.log("success!");
                })
        
                await Trips.findOne({tripID: req.body.tripID}).then((tripData) => {
    
                    var numSeats = tripData.seat.indexOf(true);
                    var newSeatArr = Array.from({length: 7}, () => false);
                    newSeatArr[numSeats - 1] = true;
                    tripData.seat = newSeatArr;
    
                    tripData.save().then(() => {
                        console.log("success Save");
                    }).catch((e) => {
                        console.log(e.message);
                    })
        
                }).catch((e) => {
                    console.log(e.message);
                })

            }).catch((e) => {
                console.log(e.message);
            })
    
        }
        else 
        {
            console.log("already joined!");
            res.status(500).send("Already joined!");    
        }
    

    }).catch((e) => {
        console.log(e.message);
    })


});

// Leave a trip as a passenger
myWebsite.post("/leave-trip", (req, res) => {

});

// View passengers for a trip
myWebsite.post("/view-passengers", (req, res) => {

});

module.exports = myWebsite