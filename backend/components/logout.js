

const express = require("express");
const mongoose = require("mongoose");
// const path = require("path");
const cors = require("cors")

var myWebsite = express();

// const upload = require("express-fileupload");
// myWebsite.use(upload());
myWebsite.use(cors());
myWebsite.use(express.json());
myWebsite.use(express.urlencoded({extended:true}));

// myWebsite.set("views",path.join(__dirname,"../frontend/src")); //This section should change to cd../frontend/src/components
// myWebsite.use(express.static(__dirname+"../frontend/src"));//For css file but I think we don't need it
// myWebsite.set("view engine","ejs")

const {check,validationResult}= require("express-validator");
const { stringify } = require("querystring");

mongoose.connect("mongodb://localhost:27017/vroom-room"),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}

//*********************************************/
// const Accounts = mongoose.model("Accounts",{
//     username:String,
//     password:String
// })

var session = require("express-session");
myWebsite.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));


myWebsite.get("/logout", function (req, res) {
    req.session.userLoggedIn = false;//set session userlogged in to false.
    res.send("Successful log out")
})

myWebsite.post("/logout", function (req, res) {
    //after click ok or next, redirect to homepage or login page if we need.
    res.send("clicked button to different page")
})

//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080")
