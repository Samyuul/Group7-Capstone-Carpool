import axios from 'axios';

// Need to remove baseURL

var http = axios.create({
    baseURL: process.env.REACT_APP_URL_PROXY,
    headers: {
        "Content-Type": "application/json"
    },
    params: {
        "page": "d"
    }
})

// Middleware interceptors for request
http.interceptors.request.use((config) => {
    
    // Send AuthKey and UserID to backend
    config.data.AuthKey = localStorage.getItem("AuthKey");
    config.data.AuthUserID = localStorage.getItem("userID");
    return config

}, function (error) {
    return Promise.reject(error);
})

// Middleware interceptors for response
http.interceptors.response.use((response) => {

    return response

}, async (error) => {

    if (error.response.status === 401) // Invalid credentials 
    {
        await localStorage.clear();
        await window.location.reload();
    } 

    return Promise.reject(error)
})

export default http