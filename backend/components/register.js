// import "../server";

//use postman to test it:

// e.g.       First make sure there is data inside local database !!!

//            POST http://localhost:8080/register/
//            Body --> from-data 
//            Key:txtUsername       Value:vincent
//            Key:txtPassword       Value:password  
//            (If there's no same username, new account created)

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

myWebsite.post("/register", function (req, res) {
    const errors = validationResult(req);
    console.log(`The validationResult is: ${errors}`);
    if(!errors.isEmpty()){
        //If we need to show why customer can't regist the account
        res.send({errors:errors.array()});                         // Don't use res.render anymore, since we are not using express to render pages, but reactJS instead
                                                                   // Use res.send to send back messages, use postman and you will see the results
    }
    else{
        var username = req.body.txtUsername;
        var password = req.body.txtPassword;

        var pageData = {
            username : username,
            password : password
        }

        Accounts.findOne({username:username}).then((account) =>{
            if(account){
                console.log(`The account already been created.`);

                // This lets you send an error, with error code 500 and custom message
                res.status(500).send({
                    message: "The account already been created."
                })
            }
            else{
                var newAccount = new Accounts(pageData);
                newAccount.save().then(function(){
                    console.log("New Account Created Successfully!");
                    res.send("New Account Created Successfully!"); // This lets you send a message (can see in postmate)
                }).catch(function(Ex){
                    console.log(`Db Error: ${Ex.toString()}`);

                    res.status(404).send({     // different error code and custom messageS
                        message: `Db Error: ${Ex.toString()}`
                    })
                })
            }
        })

    }





    // console.log(`username:${username} & password:${password}`)

    // Accounts.findOne({ username: username, password: password }).then((Accounts) => {
    //     console.log(`Accounts:${Accounts}`);
    //     if (Accounts) {
    //         req.session.username = Accounts.username;
    //         req.session.userLoggedIn = true;
    //         console.log(`Account funded`)
    //         res.redirect("/profile")
    //     }
    //     else {

    //     }
    // }).catch((err) => {
    //     console.log(`Error: ${err}`);
    // })
})



//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080")
