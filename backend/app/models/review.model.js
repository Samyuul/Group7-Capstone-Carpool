module.exports = (mongoose) => {

    const Review = mongoose.model("Reviews", {
        name: String,
        username: String,
        posterID: String,
        subject: String,
        rating: String,
        start: String,
        end: String,
        date: String,
        type: String,
        reviewID: String,
        desc: String,
        subjectID: String,
        subjectUsername: String,
        subjectName: String
    })

    return Review
}