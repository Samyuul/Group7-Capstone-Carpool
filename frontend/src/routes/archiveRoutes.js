import http from "./http-common"

const getArchivedTrips = (data) => {
    return http.post("/get-archived", data);
}

const getSingleArchivedTrip = (data) => {
    return http.post("/get-single-archived", data);
}

const archiveTrip = (data) => {
    return http.post("/archive-trip", data);
}

const ArchiveRoutes = {
    getArchivedTrips,
    getSingleArchivedTrip,
    archiveTrip
}

export default ArchiveRoutes