import http from "./http-common"

const registerAccount = (data) => {
    return http.post("/register", data);  
}

const checkLoginInfo = (data) => {
    return http.post("/login", data);
}

const logoutSession = (data) => {
    return http.post("/logout", data);
}

const AccountRoutes = {
    registerAccount,
    checkLoginInfo,
    logoutSession
}

export default AccountRoutes