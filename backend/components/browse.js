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
  PostedTime: String,
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

myWebsite.get("/browse", function (req, res) {
  //PostedFor = "Driver";
  PostedFor = "Passanger";

  RidesDetails.find({
    PostedFor: PostedFor,
  })
    .sort({ PostedTime: "desc" })
    .then((RidesDetail) => {
      if (RidesDetail.length > 0) {
        const messageList = [];
        RidesDetail.forEach((detail) => {
          const { StartingPoint, Destination, DepartureTime, SeatsTotal,PostedBy } = detail;
          console.log(
            `From:${StartingPoint};To:${Destination}; When:${DepartureTime}; Seats:${SeatsTotal}; By:${PostedBy}.`
          );
          messageList.push(
            `From:${StartingPoint};To:${Destination}; When:${DepartureTime}; Seats:${SeatsTotal}; By:${PostedBy}.`
          );
        });
        res.send(messageList.join(`\n`));
      } else {
        res.send("No Message");
      }
    })
    .catch(function (Ex) {
      res.status(404).send({
        message: `Db Error: ${Ex.toString()}`,
      });
    });
});



//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080");
