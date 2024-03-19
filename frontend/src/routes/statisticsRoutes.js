import http from "./http-common"

const retrieveStatistics = (data) => {
    return http.post("/get-stats", data);
}

const editStatistics = (data) => {
    return http.post("edit-stats", data);
}

const StatisticsRoutes = {
    retrieveStatistics,
    editStatistics
}

export default StatisticsRoutes