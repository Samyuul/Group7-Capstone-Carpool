require('dotenv').config(); 

const express = require("express");
const myWebsite = express.Router();
const mongoose = require("mongoose");
const cors = require('cors'); 

const multer = require("multer");
const Aws = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

myWebsite.use(cors())
myWebsite.use(express.urlencoded({extended:true}));
myWebsite.use(express.json());

mongoose.connect(process.env.MONGO_URI),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}

const Accounts = require("./account.model.js")(mongoose);
const Sessions = require("./session.mode.js")(mongoose);
const Profiles = require("./profile.model.js")(mongoose);
const Statistics = require("./statistics.model.js")(mongoose);
const Trips = require("./trip.model.js")(mongoose);
const Archives = require("./archived.mode.js")(mongoose);
const Passengers = require("./passenger.model.js")(mongoose);
const Reviews = require("./review.model.js")(mongoose);

const db = {};

// Middleware function
const checkValidLogin = (req, res, next) => {

    const authKey = req.body.AuthKey;
    const authUserID = req.body.AuthUserID;

    // Check with user's session variables
    Sessions.findOne({userID: authUserID, authKey: authKey})
    .then((response) => {

        if (response) // Session exists
            next();
        else
            res.status(401).send("Invalid Credentials");

    }).catch((e) => {
        res.status(500).send(e.message);
    })

}

db.mongoose = mongoose;
db.Accounts = Accounts;
db.Sessions = Sessions;
db.Profiles = Profiles;
db.Statistics = Statistics;
db.myWebsite = myWebsite;
db.Trips = Trips;
db.Archives = Archives;
db.Passengers = Passengers;
db.Reviews = Reviews;
db.multer = multer;
db.Aws = Aws;
db.checkValidLogin = checkValidLogin;

module.exports = db;