const db = require("../models"); 

// Models
const Profiles = db.Profiles;
const Trips = db.Trips;
const Passengers = db.Passengers;
const Archives = db.Archives;

const myWebsite = db.myWebsite;

const multer = db.multer;
const Aws = db.Aws;

const checkValidLogin = db.checkValidLogin;

const { v4: uuidv4 } = require('uuid');

// Determine storage variable
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

// Determine type of file uploaded
const fileFilter = (req, file, cb) => {

    const types = file.mimetype.split("/");

    if(types[0] === 'image')
        cb(null, true)
    else
        cb(null, false)

}

// Configuration of Photo Being uploaded 
const upload = multer({storage: storage, fileFilter: fileFilter});

// New s3 instance
const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
})

// Get profile
myWebsite.post("/get-profile", checkValidLogin, (req, res) => {
    
    var userID = req.body.userID;
    
    Profiles.findOne({userID:userID})
    .then((profile) => {

        if (profile) // profile exists
        {
            res.send(profile);
        }
        else
        {
            res.status(404).send({
                message: "User doesn't exist"
            })
        }
    })
});

// Get other's profile
myWebsite.post("/get-other-profile", checkValidLogin, (req, res) => {

    var username = req.body.username;
    var lowercase = username.toLowerCase();

    Profiles.findOne({lowercase:lowercase})
    .then((profile) => {

        if (profile) // profile exists
        {
            res.send(profile);
        }
        else
        {
            res.status(404).send({
                message: "User doesn't exist"
            })
        }
    })

})

// Edit profile
myWebsite.post("/edit-profile", upload.single('file'), checkValidLogin, async (req, res) => { 

    var data = JSON.parse(req.body.document);

    await Profiles.findOne({userID: data.userID}).then(async (currProfile) => {

        if(currProfile) // currProfile exists
        {
            if (currProfile.firstName !== data.firstName || 
                currProfile.lastName !== data.lastName) // Update name on postings
            {
    
                // Update name of in postings
                await Trips.updateMany(
                    { userID: data.userID}, 
                    { $set: {"name" : data.firstName + " " + data.lastName} }
                );

                // Update name inside archived posts
                await Archives.updateMany(
                    { passengerID: {$in: data.userID} },
                    { $set: {"passengerName.$[name]" : data.firstName + " " + data.lastName} },
                    { arrayFilters: [ {"name" : currProfile.firstName + " " + currProfile.lastName}] }
                );

                // Update name inside passengers collection
                await Passengers.updateMany(
                    { passengerID: {$in: data.userID} },
                    { $set: {"passengerName.$[name]" : data.firstName + " " + data.lastName} },
                    { arrayFilters: [ {"name" : currProfile.firstName + " " + currProfile.lastName}] }
                );

                // Update Reviews as author
                await db.Reviews.updateMany(
                    { posterID: data.userID },
                    { $set: {"name" : data.firstName + " " + data.lastName} }
                );

                // Update Reviews as subject
                await db.Reviews.updateMany(
                    { subjectID: data.userID },
                    { $set: {"subjectName" : data.firstName + " " + data.lastName} }
                )

                currProfile.firstName = data.firstName;
                currProfile.lastName = data.lastName;

            } 
    
            currProfile.age = data.age;
            currProfile.desc = data.desc;
            currProfile.gender = data.gender;
            currProfile.day = data.day;
            currProfile.month = data.month;
            currProfile.year = data.year;
    
            if(req.file) // Uploaded image
            {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: uuidv4(),
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: req.file.mimetype
                }
                
                console.log(params);

                await s3.upload(params, async (error, aws_response) => {

                    console.log(error);
                    console.log(aws_response);

                    if(error) {
                        res.status(500).send(error.message);
                    }
                    else
                    {
                        if(currProfile.profileImage) // Image already exists
                        {
                            var arr = currProfile.profileImage.split("/");
                            var prevID = arr.pop();

                            // Delete previous image object from bucket
                            var prevParams = {
                                Bucket: process.env.AWS_BUCKET_NAME,
                                Key: prevID
                            }

                            await s3.deleteObject(prevParams, (err, prevData) => {

                                if(error) {
                                    res.status(500).send(error.message);
                                }
                            }).promise();
                        }

                        currProfile.profileImage = aws_response.Location;
                        
                        await currProfile.save().then(() => {
                            res.send(aws_response.Location);
                        })
                    }
                    
                })
                
            }
            else // Don't need to upload to s3
            {
                await currProfile.save().then(() => {
                    res.send(currProfile.profileImage);
                })
            }
        }

    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

// Get profile image of user 
myWebsite.post("/get-profile-image", (req, res) => {

    Profiles.findOne({userID: req.body.userID})
    .then((profile) => {
        res.send({profileImage: profile.profileImage, username: profile.username});
    }).catch((e) => {
        res.status(500).send(e.message);
    })

});

module.exports = myWebsite