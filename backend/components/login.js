// import "../server";

//use postman to test it:

// e.g.       First make sure there is data inside local database !!!

//            POST http://localhost:8080/login/
//            Body --> from-data 
//            Key:txtUsername       Value:vincent
//            Key:txtPassword       Value:password  
//            (If database have it, then it show account funded)

//import { mongoose,myWebsite } from "./JavaScriptCommon.js"
const {mongoose, myWebsite} = require('./JavaScriptCommon.js');

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
            console.log(`Account funded`)
            res.redirect("/profile")
        }
        else {

        }
    }).catch((err) => {
        console.log(`Error: ${err}`);
    })
})



//*********************************************/

myWebsite.listen(8080);
console.log("http://localhost:8080")
