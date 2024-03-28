module.exports = (mongoose) => {

    const Profile = mongoose.model("Profiles", {
        firstName: String,
        lastName: String,
        age: Number,
        desc: String,
        gender: String,
        day: Number,
        month: Number,
        year: Number,
        profileImage: String,
        userID: String,
        username: String,
        lowercase: String
    })

    return Profile
}