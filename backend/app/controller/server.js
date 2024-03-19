const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
var myWebsite = express();

myWebsite.use(cors()) 
myWebsite.use(express.urlencoded({extended:true}));
myWebsite.use(express.json());

mongoose.connect("mongodb://localhost:27017/vroom-room"),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}

// Import routes from other files
const accountRoutes = require("./account.controller.js");
const profileRoutes = require("./profile.controller.js");
const tripRoutes = require("./trip.controller.js");
const statisticRoutes = require("./statistics.controller.js");
const reviewRoutes = require("./review.controller.js");
const passengerRoutes = require("./passenger.controller.js");
const archivedRoutes = require("./archived.controller.js");

// Use routes
myWebsite.use(accountRoutes);
myWebsite.use(profileRoutes);
myWebsite.use(tripRoutes);
myWebsite.use(statisticRoutes);
myWebsite.use(reviewRoutes);
myWebsite.use(passengerRoutes);
myWebsite.use(archivedRoutes);

// Start server
const PORT = 8080;
myWebsite.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});