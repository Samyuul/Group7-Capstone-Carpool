const db = require("../models"); 

// Models
const Passengers = db.Passengers;
const Trips = db.Trips;
const Profiles = db.Profiles;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

const checkValidLogin = db.checkValidLogin;

// Join a trip as a passenger
myWebsite.post("/join-trip", checkValidLogin, (req, res) => {

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
    
                await trip.save().then(async () => {

                    await Trips.findOne({tripID: req.body.tripID}).then(async (tripData) => {
    
                        var numSeats = tripData.seat.indexOf(true);
                        var newSeatArr = Array.from({length: 7}, () => false);
                        newSeatArr[numSeats - 1] = true;
                        tripData.seat = newSeatArr;
        
                        await tripData.save().then(() => {
                            res.send("succes!");
                        })
                    })
                })
            })
    
        }
        else 
        {
            res.status(500).send("Already joined!");    
        }
    

    }).catch((e) => {
        res.status(404).send(e.message);
    })


});

myWebsite.post("/view-passengers", checkValidLogin, (req, res) => {

});

module.exports = myWebsite