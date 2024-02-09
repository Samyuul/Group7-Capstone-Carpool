const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
var myWebsite = express();

const upload = require("express-fileupload");
myWebsite.use(upload());

myWebsite.use(express.urlencoded({extended:true}));

myWebsite.set("views",path.join(__dirname,"views")); //This section should change to cd../frontend/src/components
myWebsite.use(express.static(__dirname+"/public"));//For css file but I think we don't need it
myWebsite.set("view engine","ejs")

const {check,validationResult}= require("express-validator");
const { stringify } = require("querystring");

mongoose.connect("mongodb://localhost:27017/vroom-room"),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}

const Accounts = mongoose.model("Accounts",{
    username:String,
    password:String
})

var session = require("express-session");
myWebsite.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));


myWebsite.get("/login", function (req, res) {
    res.render("login")
})

myWebsite.post("/login", function (req, res) {
    var username = req.body.txtUsername;
    var password = req.body.txtPassword;

    console.log(`username:${username} & password:${password}`)

    Accounts.findOne({ username: username, password: password }).then((Accounts) => {
        console.log(`Accounts:${Accounts}`);
        if (Accounts) {
            req.session.username = Accounts.username;
            req.session.userLoggedIn = true;
            res.redirect("/profile")
        }
        else {

        }
    }).catch((err) => {
        console.log(`Error: ${err}`);
    })
})
