import "../server"


const Accounts = mongoose.model("Accounts",{
    username:String,
    password:String
})

var session = require("express-session");
myWebsite.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));


myWebsite.get("/login", function (req, res) {
    res.render("login")
})

myWebsite.post("/login", function (req, res) {
    var username = req.body.txtUsername;
    var password = req.body.txtPassword;

    console.log(`username:${username} & password:${password}`)

    Accounts.findOne({ username: username, password: password }).then((Accounts) => {
        console.log(`Accounts:${Accounts}`);
        if (Accounts) {
            req.session.username = Accounts.username;
            req.session.userLoggedIn = true;
            res.redirect("/profile")
        }
        else {

        }
    }).catch((err) => {
        console.log(`Error: ${err}`);
    })
})
