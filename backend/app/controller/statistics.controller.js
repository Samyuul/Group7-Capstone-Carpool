const db = require("../models"); 

// Models
const Statistics = db.Statistics;

const mongoose = db.mongoose;
const myWebsite = db.myWebsite;

const { v4: uuidv4 } = require('uuid');

// Retrieve statistics
myWebsite.post("/get-stats", (req, res) => {

    var userID = req.body.userID;

    Statistics.findOne({userID:userID}).then((stats) => {

        if (stats) // statistics exists
        {
            res.send(stats);
        }
        else
        {
            res.status(404).send({
                message: "User doesn't exist"
            })
        }
    })

});

module.exports = myWebsite