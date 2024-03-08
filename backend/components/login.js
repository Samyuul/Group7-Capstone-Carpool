

//use postman to test it:

// e.g.       First make sure there is data inside local database !!!

//            POST http://localhost:8080/login/
//            Body --> from-data 
//            Key:txtUsername       Value:vincent
//            Key:txtPassword       Value:password  
//            (If database have it, then it show account funded)

const express = require("express");
const myWebsite = express.Router();
const mongoose = require("mongoose");
const cors = require('cors'); // You need to add this to every page
// var myWebsite = express();
const upload = require("express-fileupload");//need this !!!!!!!!!!!!
myWebsite.use(upload());//need this !!!!!!!!!!!!


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

const CookiesID = mongoose.model("CookiesID",{
    username:String,
    userID:String,
})

var session = require("express-session");
myWebsite.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

function generateRandomId(length) {
    // Define the characters that can be part of the ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    // Generate a string of the specified length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }

// For example, you can delete this since we are rendering the login page using reactJS, you won't need res.render anywhere
// Don't need to set ejs, view and all the other things we learned in the javascript course
// myWebsite.get("/login", function (req, res) {
//     res.render("login");
// })

myWebsite.get("/login", function (req, res) {
    
    res.send("This is the login page")
})


myWebsite.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    console.log(`username:${username} & password:${password}`)

    Accounts.findOne({ username: username, password: password }).then((Accounts) => {
        console.log(`Accounts:${Accounts}`);
        
        if (Accounts) {
            //req.session.username = Accounts.username;
            //req.session.userLoggedIn = true;
            //const username=req.session.username;
            
            
            CookiesID.findOne({username:username}).then((CookieID) =>{
                if(CookieID){
                    console.log(`Account haven't logout yet!`);
                    console.log(`Account CookiesID:${CookieID}`)
                    // This lets you send an error, with error code 500 and custom message
                    res.status(500).send({
                        message: "Account haven't logout yet!."
                    })
                }
                else{
                    const userID = generateRandomId(10);

                    var newInput = {
                        username : username,
                        userID : userID,
                    }

                    var newCookieID = new CookiesID(newInput);
                    
                    newCookieID.save().then(function(){
                        console.log("New newCookieID Created Successfully!");
                        res.send("New newCookieID Created Successfully!"); // This lets you send a message (can see in postmate)
                    }).catch(function(Ex){
                        console.log(`Db Error: ${Ex.toString()}`);
                        res.status(404).send({     // different error code and custom messageS
                            message: `Db Error: ${Ex.toString()}`
                        })
                    })

                
                
                }
            })
        }
        else{
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

// myWebsite.listen(8080);
// console.log("http://localhost:8080")
module.exports = myWebsite;
