import http from "./http-common"

const createTrip = (data) => {
    return http.post("/create-post", data);
}

const editTrip = (data) => {
    return http.post("/edit-post", data);
}

const getActiveTrip = (data) => {
    return http.post("/get-active", data);
}

const getSearchResults = (data) => {
    return http.post("/get-filtered-active", data);
}

const getTrip = (data) => {
    return http.post("/get-post", data);
}

const getBrowseTrip = (data) => {
    return http.post("/browse-all", data);
}

const deleteTrip = (data) => {
    return http.post("/delete-trip", data);
}

const getTripsAsPassenger = (data) => {
    return http.post("/retrieve-passenger-trips", data);
}

const leaveTrip = (data) => {
    return http.post("leave-trip", data);
}

const TripRoutes = {
    createTrip,
    editTrip,
    getTrip,
    getBrowseTrip,
    deleteTrip,
    getActiveTrip,
    getSearchResults,
    getTripsAsPassenger,
    leaveTrip
}

export default TripRoutes