import "./view-post.css"

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const ViewPost = (props) => {

    const { postID } = useParams();

    return (
        <div id="view-post-page">
            <div>Profile Picture</div>
            <Link to={"/profile/" + postID}>View Profile</Link>
            <div>Post Info</div>
            <div>Booking section</div>
            <div>User Info</div>
            {postID}
        </div>
    )

}

export default ViewPost