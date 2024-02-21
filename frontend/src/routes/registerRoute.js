import http from "./http-common"

const registerAccount = (username, password) => {
    return http.post(`http://localhost:8080/register/?txtUsername=${username}&txtPassword=${password}`)
}

const testFunc2 = (test1, test2) => {

}

const RegisterRoutes = {
    registerAccount,
    testFunc2
}

export default RegisterRoutes