import http from './http-common'

const retrieveAllReviews = (data) => {
    return http.post("/retrieve-all-reviews", data);
}

const createReview = (data) => {
    return http.post("/create-review", data);
}

const retrieveSingleReview = (data) => {
    return http.post("/retrieve-review", data);
}

const editReview = (data) => {
    return http.post("/edit-review", data);
}

const deleteReview = (data) => {
    return http.post("/delete-review", data);
}

const retrieveWrittenReviews = (data) => {
    return http.post("/retrieve-my-written-reviews", data);
}

const ReviewRoutes = {
    retrieveAllReviews,
    editReview,
    createReview,
    retrieveSingleReview,
    deleteReview,
    retrieveWrittenReviews
}

export default ReviewRoutes