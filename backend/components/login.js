// import "../server";

//use postman to test it:

// e.g.       First make sure there is data inside local database !!!

//            POST http://localhost:8080/login/
//            Body --> from-data 
//            Key:txtUsername       Value:vincent
//            Key:txtPassword       Value:password  
//            (If database have it, then it show account funded)

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); // You need to add this to every page

var myWebsite = express();
myWebsite.use(cors()) // You need to add this to every page

myWebsite.use(express.urlencoded({extended:true}));
myWebsite.use(express.json());

const {check,validationResult}= require("express-validator");
const { stringify } = require("querystring");

mongoose.connect("mongodb://localhost:27017/vroom-room"),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}

//*********************************************/
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

// For example, you can delete this since we are rendering the login page using reactJS, you won't need res.render anywhere
// Don't need to set ejs, view and all the other things we learned in the javascript course
myWebsite.get("/login", function (req, res) {
    res.render("login");
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
            console.log(`Account funded`);
            res.send("/profile"); // Don't use redirect either, you can just send the expected url path and we can do it client side
            // res.redirect("/profile")
        }
        else {
            console.log("No account found");
            res.status(500).send({                               
                message: "No account found"
            })        }
    }).catch((err) => {
        console.log(`Error: ${err}`);

        // Error codes https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        res.status(404).send({
            message: `Error: ${err}`
        })
    })
})



//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080")
