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

const getProfileImage = (data) => {
    return http.post("/get-profile-image", data);
}

const ProfileRoutes = {
    retrieveProfile,
    editProfile,
    retrieveOthersProfile,
    getProfileImage
}

export default ProfileRoutes