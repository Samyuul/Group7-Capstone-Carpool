import "./header.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { browserHistory } from 'react-router';

const Header = (props) => {

    return (
        <header>
            <div id="header-post">
                <Link to={"/browse"}>Browse</Link>
                <Link to={"/post"}>Post</Link>
            </div>

            <div id="header-title">
                <h1>Vroom Room</h1>
            </div>
            
            <div id="header-login">
                {(props.userName === "") ? "" : <Link to={"/profile/" + props.userName}>View Profile</Link> }
                {(props.userName === "") ? <Link to={"/login"}>Login</Link> : <Link to={"/logout"}>Logout</Link> }
            </div>
        </header>
    )

}

export default Header