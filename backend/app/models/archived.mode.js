module.exports = (mongoose) => {

    const Archived = mongoose.model("Archive", {
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
        postType: Boolean,
        username: String,
        userID: String,
        passengerID: [String],
        passengerUsername: [String],
        passengerName: [String]
    })

    return Archived
}