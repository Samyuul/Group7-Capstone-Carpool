module.exports = (mongoose) => {

    const Trip = mongoose.model("Trips", {
        start: String,
        end: String,
        waypoints: [String],
        date: String,
        depart: String,
        return: String,
        model: String,
        type: String,
        color: String,
        plate: String,
        luggage: [Boolean],
        seat: [Boolean],
        pref: [Boolean],
        desc: String,
        distance: Number,
        eta: Number,
        name: String,
        tripID: String,
        userID: String,
        postType: Boolean,
        username: String,
        optimize: Boolean
    })

    return Trip
}