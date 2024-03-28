const db = require("../models"); 

// Models 
const Archives = db.Archives;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

const checkValidLogin = db.checkValidLogin;

// Retrieve Archived Posts
myWebsite.post("/get-archived", checkValidLogin, (req, res) => {

    Archives.find({$or: [{userID: req.body.userID}, {passengerID: {$in: req.body.userID}}]})
    .then((archives) => {
        res.send(archives);
    }).catch((e) => {
        res.status(404).send(e.message);
    })

});

// Retrieve a singular archived post
myWebsite.post("/get-single-archived", checkValidLogin, (req, res) => {

    Archives.findOne({tripID: req.body.tripID})
    .then((response) => {
        res.send(response)
    }).catch((e) => {
        res.status(404).send(e.message);
    })

});

module.exports = myWebsite;