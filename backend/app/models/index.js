const express = require("express");
const myWebsite = express.Router();
const mongoose = require("mongoose");
const cors = require('cors'); 

myWebsite.use(cors())
myWebsite.use(express.urlencoded({extended:true}));
myWebsite.use(express.json());

mongoose.connect("mongodb://localhost:27017/vroom-room"),{
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

module.exports = db;