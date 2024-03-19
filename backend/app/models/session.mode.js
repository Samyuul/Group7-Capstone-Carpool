module.exports = (mongoose) => {

    const Session = mongoose.model("Sessions", {
        userID: String,
        authKey: String
    })

    return Session
}