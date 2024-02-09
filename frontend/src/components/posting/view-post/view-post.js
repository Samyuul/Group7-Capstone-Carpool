import "./view-post.css"

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewPost = (props) => {

    const { postID } = useParams();

    return (
        <div>
            {postID}
        </div>
    )

}

export default ViewPost