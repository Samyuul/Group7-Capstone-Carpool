require("dotenv").config();
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
var myWebsite = express();

myWebsite.use(cors()) 
myWebsite.use(express.urlencoded({extended:true}));
myWebsite.use(express.json());

mongoose.connect(process.env.MONGO_URI),{
    UserNewUrlParser: true,
    UserUnifiedTopology:true
}

// Import routes from other files
const accountRoutes = require("./app/controller/account.controller.js");
const profileRoutes = require("./app/controller/profile.controller.js");
const tripRoutes = require("./app/controller/trip.controller.js");
const statisticRoutes = require("./app/controller/statistics.controller.js");
const reviewRoutes = require("./app/controller/review.controller.js");
const passengerRoutes = require("./app/controller/passenger.controller.js");
const archivedRoutes = require("./app/controller/archived.controller.js");

// Use routes
myWebsite.use(accountRoutes);
myWebsite.use(profileRoutes);
myWebsite.use(tripRoutes);
myWebsite.use(statisticRoutes);
myWebsite.use(reviewRoutes);
myWebsite.use(passengerRoutes);
myWebsite.use(archivedRoutes);

// Deployments
__dirname = path.resolve();

if (process.env.NODE_ENV === "production2") {

    myWebsite.use(express.static(path.join(__dirname, 'frontend/build')));

    myWebsite.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })

}

// Start server
const PORT = process.env.PORT || 8080;
myWebsite.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

