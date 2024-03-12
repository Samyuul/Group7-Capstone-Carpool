const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); // You need to add this to every page
var myWebsite = express();


const upload = require("express-fileupload");//need this !!!!!!!!!!!!
myWebsite.use(upload());//need this !!!!!!!!!!!!


myWebsite.use(cors()) // You need to add this to every page
myWebsite.use(express.urlencoded({extended:true}));
myWebsite.use(express.json());

mongoose.connect("mongodb://localhost:27017/vroom-room"),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}


var session = require("express-session");
myWebsite.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));


// Import routes from other files
const loginRoute = require("./login");
const logoutRoute = require("./logout");

// Use routes
myWebsite.use(loginRoute);
myWebsite.use(logoutRoute);

// Start server
const PORT = 8080;
myWebsite.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});