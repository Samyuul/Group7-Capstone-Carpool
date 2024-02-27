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
const Messages = mongoose.model("Messages", {
  usernameSentFrom: String,
  usernameSentTo: String,
  message: String,
  time: String,
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

myWebsite.get("/message/:usernameto", function (req, res) {
  
    const usernameSentFrom = "vincent";
    const usernameSentTo = "sam";
    console.log(`Welcome, ${usernameSentFrom}, here's record with ${usernameSentTo}`);
    

    Messages.find({
      usernameSentFrom: usernameSentFrom,
      usernameSentTo: usernameSentTo,
    })
      .sort({ time: "desc" })
      .then((messageHistory) => {
        
        if (messageHistory.length > 0) {
          const messageList=[];
          messageHistory.forEach(reply=>{
          const{usernameSentFrom,usernameSentTo,message,time}=reply;
          console.log(`From:${usernameSentFrom};To:${usernameSentTo};Message:${message};Time:${time}.`)
          messageList.push(`From:${usernameSentFrom};To:${usernameSentTo};Message:${message};Time:${time}.`);
        })
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
