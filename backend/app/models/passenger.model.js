module.exports = (mongoose) => {

    const Passenger = mongoose.model("Passengers", {
        driverID: String,
        passengerID: [String],
        tripID: String,
        driverUsername: String,
        passengerUsername: [String],
        passengerName: [String]
    })

    return Passenger
}