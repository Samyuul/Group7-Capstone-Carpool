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
const RidesDetails = mongoose.model("RidesDetails", {
  StartingPoint: String,
  Destination: String,
  AdditionalStops: String,
  DepartureTime: String,
  SeatsTaken: Number,
  SeatsTotal: Number,
  Preference: String,
  Description: String,
  PostedBy: String,
  PostedFor: String,
  PostedTime:String,
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
    const username = req.session.username;
    res.send(`Welcome, ${username}`);
  } else {
    res.send(`Can't find session`);
  }
});

myWebsite.post("/driver", function (req, res) {
  if (req.session.userLoggedIn) {
    var StartingPoint = req.body.txtStartingPoint;
    var Destination = req.body.txtDestination;
    var AdditionalStops = req.body.txtAdditionalStops;
    var DepartureTime = req.body.txtDepartureTime;
    var SeatsTotal = req.body.txtSeatsTotal;
    var Preference = req.body.txtPreference;
    var Description = req.body.txtDescription;
    var PostedBy = req.session.username;
    var PostedFor = "Driver";
    var PostedTime = new Date();

    var postDetails = {
      StartingPoint: StartingPoint,
      Destination: Destination,
      AdditionalStops: AdditionalStops,
      DepartureTime: DepartureTime,
      SeatsTotal: SeatsTotal,
      Preference: Preference,
      Description: Description,
      PostedBy: PostedBy,
      PostedFor: PostedFor,
      PostedTime : PostedTime,
    };

  

    RidesDetails.findOne().then((ridesdetail) => {
      
        var newRide = new RidesDetails(postDetails);
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
  }

  res.send("clicked button to different page");
});

//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080");
