const db = require("../models"); 

// Models 
const Trips = db.Trips;
const Passengers = db.Passengers;
const Archives = db.Archives;
const Statistics = db.Statistics;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const checkValidLogin = db.checkValidLogin;

const { v4: uuidv4 } = require('uuid');

// Create a new post
myWebsite.post("/create-post", checkValidLogin, async (req, res) => {

    var dates = req.body.date;

    // Loop for each possible date
    for (const date of dates) { 

        var currTripID = uuidv4();

        var tripData = {
            start: req.body.start,
            end: req.body.end,
            waypoints: req.body.waypoints,
            date: date,
            depart: req.body.depart,
            return: req.body.return,
            model: req.body.model,
            type: req.body.type,
            color: req.body.color,
            plate: req.body.plate,
            luggage: req.body.luggage,
            seat: req.body.seat,
            pref: req.body.pref,
            desc: req.body.desc,
            distance: req.body.distance,
            eta: req.body.eta,
            name: req.body.name,
            tripID: currTripID,
            postType: req.body.postType,
            userID: req.body.userID,
            username: req.body.username,
            optimize: req.body.optimize
        }    
        
        var newTrip = new Trips(tripData);
        await newTrip.save().then(async () => {

            if (req.body.postType) // Is a trip post
            {
                var PassengerData = {
                    driverID: req.body.userID,
                    driverUsername: req.body.username,
                    tripID: currTripID,
                    passengerID: [],
                    passengerUsername: [],
                    passengerName: []
                }
    
                var newPassengerData = new Passengers(PassengerData);
                await newPassengerData.save();
            }

        }).catch((e) => {
            res.status(500).send(e.message);
        })

    }

    res.send("new trip(s) created successfully!");

});

// Edit a post
myWebsite.post("/edit-post", checkValidLogin, async (req, res) => {

    var tripID = req.body.tripID
    
    await Trips.findOne({tripID:tripID}).then(async (currTrip) => {
    
        currTrip.start = req.body.start;
        currTrip.end = req.body.end;
        currTrip.waypoints = req.body.waypoints;
        currTrip.date = req.body.date[0]; // Date is given in the form of [date]
        currTrip.depart = req.body.depart;
        currTrip.return = req.body.return;
        currTrip.model = req.body.model;
        currTrip.type = req.body.type;
        currTrip.color = req.body.color;
        currTrip.plate = req.body.plate;
        currTrip.luggage = req.body.luggage;
        currTrip.seat = req.body.seat;
        currTrip.pref = req.body.pref;
        currTrip.desc = req.body.desc;
        currTrip.distance = req.body.distance;
        currTrip.eta = req.body.eta;
        currTrip.optimize = req.body.optimize;

        await currTrip.save().then(() => {
            res.send("success");
        })

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Retrieve a single driver's trip
myWebsite.post("/get-post", checkValidLogin, async (req, res) => {

    var tripID = req.body.tripID;

    await Trips.findOne({tripID:tripID}).then((Trip) => {

        if (Trip) 
            res.send(Trip);
        else 
            res.status(500).send("Error!");
    })

});

// Retrieve all active trips for a user for history page
myWebsite.post("/get-active", checkValidLogin, async (req, res) => {

    var userID = req.body.userID;
    var postType = req.body.postType;

    await Trips.find({userID: userID, postType: postType}).then((AllActiveTrips) => {
        res.send(AllActiveTrips);
    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Retrieve all active trips based on search conditions
myWebsite.post("/get-filtered-active", async (req, res) => {

    var startConditions = [];
    var endConditions = [];
    var conditions = [];

    // Locations can be included in waypoint
    if(!!req.body.startLoc)
    {
        conditions.push({$or: [
            {start: req.body.startLoc},
            {waypoints: {$in: req.body.startLoc}}
        ]})
    }

    if(!!req.body.endLoc)
    {
        conditions.push({$or: [
            {end: req.body.endLoc},
            {waypoints: {$in :req.body.endLoc}}
        ]})
    }

    // Includes a date
    if(req.body.dates.length)
        conditions.push({date: {$in: req.body.dates}});

    // Ignore full trips, but still include requests
    if(req.body.fullFlag)
        conditions.push({$or: [{seat: {$in: true}}, {postType: false}]});

    // Ignore requests
    if(req.body.requestFlag)
        conditions.push({postType: true});

    // Join conditions together if necessary
    var filterConditions = conditions.length ? {$and: conditions} : {};

    await Trips.find(filterConditions)
    .then((SearchResult) => {
        res.send(SearchResult);        
    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Retrieve all trips for browse page 
myWebsite.post("/browse-all", async (req, res) => {

    await Trips.find().then((AllTrips) => {
        res.send(AllTrips);
    }).catch((e) => {
        res.status(500).send("Error!");
    })

});

// Delete any trip
myWebsite.post("/delete-trip", checkValidLogin, async (req, res) => {
    
    var tripID = req.body.tripID;
    
    await Trips.findOneAndDelete({tripID:tripID}).then((Trip) => {
        res.send("success!");
    }).catch((e) => {
        res.status(500).send("Error!");
    })
});

// Archive a trip
myWebsite.post("/archive-trip", checkValidLogin, async (req, res) => {

    await Archives.findOne({tripID: req.body.tripID})
    .then(async (Archive) => {

        if(!Archive) // No archive exists already
        {
            
            await Trips.findOneAndDelete({tripID: req.body.tripID})
            .then(async (Trip) => {

                if (Trip.postType) // Driver time, don't archive requests
                {
                    await Passengers.findOne({tripID: req.body.tripID})
                    .then(async (Passenger) => {
    
                        var ArchiveData = {
                            start: Trip.start,
                            end: Trip.end,
                            waypoints: Trip.waypoints,
                            date: Trip.date,
                            depart: Trip.depart,
                            return: Trip.return,
                            model: Trip.model,
                            type: Trip.type,
                            color: Trip.color,
                            plate: Trip.plate,
                            luggage: Trip.luggage,
                            seat: Trip.seat,
                            pref: Trip.pref,
                            desc: Trip.desc,
                            distance: Trip.distance,
                            eta: Trip.eta,
                            name: Trip.name,
                            tripID: Trip.tripID,
                            postType: Trip.postType,
                            userID: Trip.userID,
                            username: Trip.username,
                            passengerID: Passenger.passengerID,
                            passengerUsername: Passenger.passengerUsername,
                            passengerName: Passenger.passengerName,
                            optimize: Trip.optimize
                        }
            
                        var ArchivedTrip = Archives(ArchiveData);
                    
                        await ArchivedTrip.save();
    
                        // Update statistics of driver
                        await Statistics.findOne({userID: ArchivedTrip.userID})
                        .then((driverStatistics) => {
            
                            driverStatistics.tripDriver += 1;
                            driverStatistics.tripDistance += ArchivedTrip.distance;
                            driverStatistics.save();
            
                        });

                        // Update statistics of passengers
                        for (const passenger of ArchivedTrip.passengerID)
                        {
                            await Statistics.findOne({userID: passenger})
                            .then((passengerStatistics) => {
                                
                                passengerStatistics.tripPassenger += 1;
                                passengerStatistics.tripDistance += ArchivedTrip.distance;
                                passengerStatistics.save();
            
                            })
                        }
    
                        res.send("success");

                        // Remove from passengers collection
                        Passengers.findOneAndDelete({tripID: req.body.tripID});
    
                    })
                }
                else 
                {
                    res.send("success");
                }

            })

        }
        else 
        {
            res.status(500).send("Already archived!");
        }

    }).catch((e) => {
        res.status(500).send(e.message);
    })

}); 

// Retrieve all trips as a passenger 
myWebsite.post("/retrieve-passenger-trips", checkValidLogin, (req, res) => {

    Passengers.find({passengerID: {$in: req.body.userID}}, {_id: 0, tripID: 1})
    .then((tripIDs) => {

        let mappedTripIDs = tripIDs.map((val, i) => {
            return (val.tripID)
        })

        let condition = {
            tripID: {$in: mappedTripIDs}
        }

        Trips.find(condition)
        .then((AllTrips) => {
            res.send(AllTrips);
        })

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Leave a trip as a passenger
myWebsite.post("/leave-trip", checkValidLogin, (req, res) => {

    Passengers.findOne({tripID: req.body.tripID})
    .then(async (trip) => {
        
        const index = trip.passengerID.indexOf(req.body.userID);
        
        if (index > -1) // Array is found
        {
            trip.passengerID.splice(index, 1);
            trip.passengerName.splice(index, 1);
            trip.passengerUsername.splice(index, 1);
        }

        trip.save().then(async () => {
           
            await Trips.findOne({tripID: req.body.tripID}).then((tripData) => {
    
                var numSeats = tripData.seat.indexOf(true);
                var newSeatArr = Array.from({length: 7}, () => false);
                newSeatArr[numSeats + 1] = true;
                tripData.seat = newSeatArr;
    
                tripData.save().then(() => {
                    res.send("success!");
                })
    
            })

        });

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

module.exports = myWebsite;