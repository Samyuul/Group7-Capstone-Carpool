module.exports = (mongoose) => {

    const Account = mongoose.model("Accounts", {
        username: String,
        password: String,
        userID: String,
        lowerCase: String
    })

    return Account
}