import http from './http-common'

const retrieveProfile = (data) => {
    return http.post("/get-profile", data);
}

const retrieveOthersProfile = (data) => {
    return http.post("/get-other-profile", data);
}

const editProfile = (data) => {
    return http.post("/edit-profile", data);
}

const ProfileRoutes = {
    retrieveProfile,
    editProfile,
    retrieveOthersProfile
}

export default ProfileRoutes