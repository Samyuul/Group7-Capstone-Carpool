module.exports = (mongoose) => {

    const Account = mongoose.model("Accounts", {
        username: String,
        password: String,
        userID: String,
        lowercase: String
    })

    return Account
}