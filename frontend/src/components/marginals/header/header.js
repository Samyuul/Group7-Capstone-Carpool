import "./header.css"
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

const Header = (props) => {

    if (localStorage.getItem("users"))
        console.log("success");
    else
        console.log("failure");

    return (
        <header>
            <div id="header-post">
                <Link to={"/browse"}>Browse</Link>
                <Link to={!localStorage.getItem('user') ? "/login" : "/post"}>Post</Link>
            </div>

            <div id="header-title">
                <h1>Vroom Room</h1>
            </div>
            
            <div id="header-login">
                {!localStorage.getItem('user') ? <></> : <Link to={"/profile/" + localStorage.getItem('user')}>View Profile</Link> }
                {!localStorage.getItem('user') ? <Link to={"/login"}>Login</Link> : <Link to={"/logout"}>Logout</Link> }
            </div>
        </header>
    )

}

export default Header