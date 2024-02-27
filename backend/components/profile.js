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
const Accounts = mongoose.model("Accounts",{
    username:String,
    password:String
})

const Profiles = mongoose.model("Profiles", {
    username:String,
    tripsAsDriver : Number,
    tripsAsPassenger : Number,
    travlledDistance : Number,
    names : String,
    joinTime : String,
    gender : String,
    age : Number,
    aboutMe : String,

});
const Reviews = mongoose.model("Reviews", {
    username:String,
    driverReviewRate : Number,
    passengerReviewRate : Number,
    reviewerName : String,
    reviewerRate : Number,
    tripFrom : String,
    tripTo : String,
    tripTime : String,
    reviewMessage : String,
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

myWebsite.get("/profile", function (req, res) {
  if (req.session.userLoggedIn) {
    const username=req.session.username;
    res.send(`Welcome, ${username}`);
  }
  else{
    res.send(`Can't find session`);
  }

  
});

myWebsite.post("/profile", function (req, res) {
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

    //use username to find the database and update info into profile.
    const username=req.session.username;
    Profiles.findById({_id:username}).then((profile)=>{
      profile.name=name,
      profile.email=email
    })


  }

  res.send("clicked button to different page");
});

//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080");
