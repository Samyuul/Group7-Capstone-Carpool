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

const Profiles = mongoose.model("Profiles", {
  username: String,
  tripsAsDriver: Number,
  tripsAsPassenger: Number,
  travlledDistance: Number,
  names: String,
  joinTime: String,
  gender: String,
  age: Number,
  aboutMe: String,
});
const Reviews = mongoose.model("Reviews", {
  username: String,
  driverReviewRate: Number,
  passengerReviewRate: Number,
  reviewerName: String,
  reviewerRate: Number,
  tripFrom: String,
  tripTo: String,
  tripTime: String,
  reviewMessage: String,
});

var session = require("express-session");
const { time, profile } = require("console");
myWebsite.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

myWebsite.get("/profile", function (req, res) {
  if (req.session.userLoggedIn) {
    const username = req.session.username;
    console.log(`Welcome, ${username}`);
    var profileInfo = "";
    //Find everything from database.

    Profiles.findOne({ username: username })
      .then((profile) => {
        if (profile) {
          console.log(`TripsAsDriver, ${profile.tripsAsDriver}`);
          console.log(`TripsAsPassenger, ${profile.tripsAsPassenger}`);
          profileInfo += `TripsAsDriver: ${profile.tripsAsDriver}; TripsAsPassenger: ${profile.tripsAsPassenger};`;
          console.log(profileInfo);
        } else {
          res.send("No Rrofile Found");
        }
      })
      .catch(function (Ex) {
        res.status(404).send({
          message: `Db Error: ${Ex.toString()}`,
        });
      });

    Reviews.findOne({ username: username })
      .then((review) => {
        if (review) {
          console.log(`DriverReviewRate, ${review.driverReviewRate}`);
          console.log(`PassengerReviewRate, ${review.passengerReviewRate}`);
          profileInfo += ` DriverReviewRate: ${review.driverReviewRate}; PassengerReviewRate: ${review.passengerReviewRate};`;
          console.log(profileInfo);
        } else {
          res.send("No Rrofile Found");
        }
      })
      .catch(function (Ex) {
        res.status(404).send({
          message: `Db Error: ${Ex.toString()}`,
        });
      })
      .then(() => {
        res.send(profileInfo);
      });

    //***************** */
  } else {
    res.send(`Can't find session`);
  }
});

myWebsite.post("/profile", function (req, res) {
  if (req.session.userLoggedIn) {
    var username = req.session.username;

    var tripsAsDriver = req.body.txtTripsAsDriver;
    var tripsAsPassenger = req.body.txtTripsAsPassenger;
    var travlledDistance = req.body.txtTravlledDistance;
    var names = req.body.txtNames;
    // var joinTime = req.body.txtJoinTime;
    // var gender = req.body.txtGender;
    // var age = req.body.txtAge;
    // var aboutMe = req.body.txtAboutMe;
    // var driverReviewRate = req.body.txtDriverReviewRate;
    // var passengerReviewRate = req.body.txtPassengerReviewRate;
    // var reviewName = req.body.txtReviewName;
    // var reviewRate = req.body.txtReviewRate;
    // var tripFrom = req.body.txtTripFrom;
    // var tripTo = req.body.txtTripTo;
    // var tripTime = req.body.txtTripTime;
    // var reviewMessage = req.body.txtReviewMessage;

    // var profileInput = {
    //   tripsAsDriver: tripsAsDriver,
    //   tripsAsPassenger: tripsAsPassenger,
    //   travlledDistance: travlledDistance,
    //   names: names,
    //   joinTime: joinTime,
    //   gender: gender,
    //   age: age,
    //   aboutMe: aboutMe,
    // };

    // var reviewInput = {
    //   driverReviewRate: driverReviewRate,
    //   passengerReviewRate: passengerReviewRate,
    //   reviewName: reviewName,
    //   reviewRate: reviewRate,
    //   tripFrom: tripFrom,
    //   tripTo: tripTo,
    //   tripTime: tripTime,
    //   reviewMessage: reviewMessage,
    // };

    //use username to find the database and update info into profile.
   
    Profiles.findOne({ username: username })
    .then((profile) => {
      profile.tripsAsDriver=tripsAsDriver;
      profile.tripsAsPassenger=tripsAsPassenger;
      profile.travlledDistance=travlledDistance;
      profile.names=names;
      profile.save();
    })
    .catch(function (Ex) {
      res.status(404).send({
        message: `Db Error: ${Ex.toString()}`,
      });
    })
    .then(() => {
      res.send(profile);
    });
    ;
  }

  res.send("clicked button to different page");
});

//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080");
