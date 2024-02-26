const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

var myWebsite = express();

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
const RidesDetails = mongoose.model("RidesDetails", {
  StartingPoint: String,
  Destination: String,
  AdditionalStops: String,
  DepartureTime: String,
  SeatsTaken: Int8Array,
  SeatsTotal: Int8Array,
  Preference: String,
  Description: String,
  PostedBy: String,
  PostedFor: String,
});

var session = require("express-session");
const { time } = require("console");
myWebsite.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

myWebsite.get("/driver", function (req, res) {
  if (req.session.userLoggedIn) {
    //need to get user's name and put it here!!!!!!!
    
    res.send("Get user's name");
  };

  
});

myWebsite.post("/driver", function (req, res) {
  if (req.session.userLoggedIn) {
    var StartingPoint = req.body.txtStartingPoint;
    var Destination = req.body.txtDestination;
    var AdditionalStops = req.body.txtAdditionalStops;
    var DepartureTime = req.body.txtDepartureTime;
    var SeatsTotal = req.body.txtSeatsTotal; //this need to check if the number is under max
    var Preference = req.body.txtPreference;
    var Description = req.body.txtDescription;

    var postDetails = {
      StartingPoint: StartingPoint,
      Destination: Destination,
      AdditionalStops: AdditionalStops,
      DepartureTime: DepartureTime,
      SeatsTotal: SeatsTotal,
      Preference: Preference,
      Description: Description,
    };
  }

  res.send("clicked button to different page");
});

//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080");
