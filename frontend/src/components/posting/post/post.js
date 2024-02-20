import "./post.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    CarFront,
    User,
    ArrowLeftLine
} from '@vectopus/atlas-icons-react';

const Post = (props) => {

    return (
        <div id="post-page">
            <h2 className="underline">What Would You Like To Do Today?</h2>
            <Link id="post-link" to="/post/trip">
                <CarFront size={44} />
                <p>Post a Future Trip</p>
                <ArrowLeftLine size={44} weight="bold" />
            </Link>

            <hr />

            <Link id="request-link" to="/post/request">
                <User size={44} />
                <p>Request a Future Trip</p>
                <ArrowLeftLine size={44} weight="bold" />
            </Link>
        </div>
    )

}

export default Post