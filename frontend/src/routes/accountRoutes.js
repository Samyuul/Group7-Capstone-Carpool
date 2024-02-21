import http from "./http-common"

const registerAccount = (data) => {
    return http.post("/register", data);  // Don't need to include http://localhost:8080/, it's in the http-common.js file already
}

const checkLoginInfo = (data) => {
    return http.post("/login", data);
}

const AccountRoutes = {
    registerAccount,
    checkLoginInfo
}

export default AccountRoutes