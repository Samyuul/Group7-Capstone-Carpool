const db = require("../models"); 

// Models
const Profiles = db.Profiles;
const Statistics = db.Statistics;
const Reviews = db.Reviews;

const myWebsite = db.myWebsite;

const checkValidLogin = db.checkValidLogin;

const { v4: uuidv4 } = require('uuid');

// Create a review 
myWebsite.post("/create-review", checkValidLogin, async (req, res) => {
    
    // Get profile 
    await Profiles.findOne({userID: req.body.userID}).then(async (profile) => {

        var reviewData = {
            name: profile.firstName + " " + profile.lastName,
            username: req.body.username,
            posterID: req.body.userID,
            subject: req.body.subject,
            rating: req.body.rating,
            start: req.body.start,
            end: req.body.end,
            date: req.body.date,
            type: req.body.type,
            reviewID: uuidv4(),
            desc: req.body.desc,
            subjectID: req.body.subjectID,
            subjectUsername: req.body.subjectUsername,
            subjectName: req.body.subjectName
        }

        var newReview = new Reviews(reviewData);

        Reviews.findOne({

            posterID: req.body.userID, 
            subjectID: req.body.subjectID,
            start: req.body.start,
            end: req.body.end,
            date: req.body.date

        }).then(async (exist) => {

            if(!exist) // Review does not exist 
            {

                await newReview.save().then(async () => {
                
                    // Update statistics
                    await Statistics.findOne({userID: req.body.subjectID}).then(async (statistic) => {
            
                        Reviews.find({subjectID: req.body.subjectID, type: req.body.type}).then((response) => {

                            var scores = response.map((val, i) => {
                                return(parseFloat(val.rating))
                            })

                            let average = 0;

                            if (scores.length) // Non empty scores
                                average = (scores.reduce((a, b) => a + b) / scores.length).toFixed(2);
                            else 
                                average = -1.1;

                            if(req.body.type === "Driver") // Update driver statistics
                                statistic.driverRating = average;
                            else if (req.body.type === "Passenger") // Update Passenger statistics
                                statistic.passengerRating = average;
                            
                            statistic.save().then(() => {
                                res.send("success!");
                            })
                        })
                    })
                })

            }
            else 
            {
                res.status(403).send("Duplicate Review");
            }
            
        })

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Retrieve all reviews for a user
myWebsite.post("/retrieve-all-reviews", checkValidLogin, (req, res) => {
  
    Reviews.find({subjectID: req.body.userID})
    .then((response) => {
        res.send(response);
    }).catch((e) => {
        res.status(500).send(e.message);
    })
    
});

// Retrieve all written reviews as a user
myWebsite.post("/retrieve-my-written-reviews", checkValidLogin, (req, res) => {
    
    Reviews.find({posterID: req.body.userID})
    .then((response) => {
        res.send(response);
    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Retrieve single review for editing
myWebsite.post("/retrieve-review", checkValidLogin, (req, res) => {
    
    Reviews.findOne({reviewID: req.body.reviewID})
    .then((response) => {
        res.send(response);
    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Update review data 
myWebsite.post("/edit-review", checkValidLogin, async (req, res) => {

    await Reviews.findOne({reviewID: req.body.reviewID})
    .then(async (currReview) => {
        
        currReview.desc = req.body.desc;
        currReview.rating = req.body.rating;
        currReview.subject = req.body.subject;

        currReview.save().then(async () => {

            // Update statistics
            await Statistics.findOne({userID: currReview.subjectID}).then(async (statistic) => {
        
                Reviews.find({subjectID: currReview.subjectID, type: currReview.type}).then((response) => {

                    var scores = response.map((val, i) => {
                        return(parseFloat(val.rating))
                    })

                    let average = 0;

                    if (scores.length) // Non empty scores
                        average = (scores.reduce((a, b) => a + b) / scores.length).toFixed(2);
                    else 
                        average = -1.1;

                    if(currReview.type === "Driver") // Update driver statistics
                        statistic.driverRating = average;
                    else if (currReview.type === "Passenger") // Update Passenger statistics
                        statistic.passengerRating = average;
                    
                    statistic.save().then(() => {})

                })
    
            })

            res.send("success!");
        })

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Delete review
myWebsite.post("/delete-review", checkValidLogin, async (req, res) => {

    await Reviews.findOneAndDelete({reviewID: req.body.reviewID})
    .then(async (currReview) => {
        
        // Update statistics
        await Statistics.findOne({userID: currReview.subjectID}).then(async (statistic) => {
                
            Reviews.find({subjectID: currReview.subjectID, type: currReview.type}).then((response) => {

                var scores = response.map((val, i) => {
                    return(parseFloat(val.rating))
                })

                let average = 0;

                if (scores.length) // Non empty scores
                    average = (scores.reduce((a, b) => a + b) / scores.length).toFixed(2);
                else 
                    average = -1.1;

                if(currReview.type === "Driver") // Update driver statistics
                    statistic.driverRating = average;
                else if (currReview.type === "Passenger") // Update Passenger statistics
                    statistic.passengerRating = average;
                
                statistic.save().then(() => {
                    res.send("success!");
                })

            })

        })

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

module.exports = myWebsite