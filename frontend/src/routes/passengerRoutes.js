import http from './http-common'

const joinTrip = (data) => {
    return http.post("/join-trip", data);
}

const viewPassengers = (data) => {
    return http.post("/view-passengers", data);
}

const PassengerRoutes = {
    joinTrip,
    viewPassengers
}

export default PassengerRoutes