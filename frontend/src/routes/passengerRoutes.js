import http from './http-common'

const joinTrip = (data) => {
    return http.post("/join-trip", data);
}

const leaveTrip = (data) => {
    return http.post("/leave-trip", data);
}

const viewPassengers = (data) => {
    return http.post("/view-passengers", data);
}

const PassengerRoutes = {
    joinTrip,
    leaveTrip,
    viewPassengers
}

export default PassengerRoutes