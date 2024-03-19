const db = require("../models"); 

// Models 
const Archives = db.Archives;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

// Retrieve Archived Posts
myWebsite.post("/get-archived", (req, res) => {

    Archives.find({$or: [{userID: req.body.userID}, {passengerID: {$in: req.body.userID}}]})
    .then((archives) => {
        res.send(archives);
    }).catch((e) => {
        console.log(e.message);
    })

});

myWebsite.post("/get-single-archived", (req, res) => {

    Archives.findOne({tripID: req.body.tripID})
    .then((response) => {
        res.send(response)
    }).catch((e) => {
        console.log(e.message);
    })

});

module.exports = myWebsite;