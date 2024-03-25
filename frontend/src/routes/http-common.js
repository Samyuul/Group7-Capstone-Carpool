import axios from 'axios';

console.log(process.env.REACT_APP_URL_PROXY);

export default axios.create({
    baseURL: process.env.REACT_APP_URL_PROXY,
    headers: {
        "Content-Type": "application/json"
    }
})