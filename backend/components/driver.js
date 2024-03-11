const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

var myWebsite = express();

const upload = require("express-fileupload");
myWebsite.use(upload());
myWebsite.use(cors());
myWebsite.use(express.json());
myWebsite.use(express.urlencoded({ extended: true }));

const { check, validationResult } = require("express-validator");
const { stringify } = require("querystring");

mongoose.connect("mongodb://localhost:27017/vroom-room"),
  {
    UserNewUrlParser: true,
    UserUnifiedTopology: true,
  };

/*************************************************/
const DriverDetails = mongoose.model("DriverDetails", {
  start: String,
  end: String,
  waypoints: String,
  date: String,
  depart: String,
  returns: String,
  model: String,
  type: String,
  color: String,
  plate: String,
  luggage: String,
  seat: String,
  pref: String,
  desc: String,
  distance: String,
  eta: String,
  name: String,
  tripID: String,
});

var session = require("express-session");
const { time } = require("console");
const { copyFileSync } = require("fs");
myWebsite.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

myWebsite.get("/driver", function (req, res) {
  // if (req.session.userLoggedIn) {
  //   const username = req.session.username;
  //   res.send(`Welcome, ${username}`);
  // } else {
  //   res.send(`Can't find session`);
  // }
});

myWebsite.post("/driver", function (req, res) {
  //if (req.session.userLoggedIn) {

  var start = req.body.start;
  var end = req.body.end;
  var waypoints = req.body.waypoints;
  var date = req.body.date;
  var depart = req.body.depart;
  var returns = req.body.return;
  var model = req.body.model;
  var type = req.body.type;
  var color = req.body.color;
  var plate = req.body.plate;
  var luggage = req.body.luggage;
  var seat = req.body.seat;
  var pref = req.body.pref;
  var desc = req.body.desc;
  var distance = req.body.distance;
  var eta = req.body.eta;
  var name = req.body.name;
  var tripID = req.body.tripID;

  var postDetails = {
    start: start,
    end: end,
    waypoints: waypoints,
    date: date,
    depart: depart,
    returns: returns,
    model: model,
    type: type,
    color: color,
    plate: plate,
    luggage: luggage,
    seat: seat,
    pref: pref,
    desc: desc,
    distance: distance,
    eta: eta,
    name: name,
    tripID: tripID,
  };

  DriverDetails.findOne().then(() => {
    var newRide = new DriverDetails(postDetails);
    newRide
      .save()
      .then(function () {
        res.send("New Account Created Successfully!");
      })
      .catch(function (Ex) {
        res.status(404).send({
          message: `Db Error: ${Ex.toString()}`,
        });
      });
  });
  //}

  console.log("clicked button to different page");
});

//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080");
