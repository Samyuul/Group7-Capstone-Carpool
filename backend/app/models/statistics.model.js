module.exports = (mongoose) => {

    const Statistics = mongoose.model("Statistics", {
        joined: String,
        tripDriver: Number,
        tripPassenger: Number,
        tripDistance: Number,
        passengerRating: Number,
        driverRating: Number,
        userID: String
    })

    return Statistics
}