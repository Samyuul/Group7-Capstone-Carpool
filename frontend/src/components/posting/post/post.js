import "./post.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Post = (props) => {


    return (
        <div id="post-page">
            <Link to="/post/trip">Post a future trip</Link>
            <Link to="/post/request">Request a future trip</Link>
        </div>
    )

}

export default Post