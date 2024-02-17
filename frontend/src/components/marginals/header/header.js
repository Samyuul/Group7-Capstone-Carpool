import "./header.css"
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { 
    PlusCircle, 
    MagnifyingGlass
} from '@vectopus/atlas-icons-react';

const Header = (props) => {

    const getProfileImage = () => {
        return require('../../../img/thumbnail.webp');
    }

    const handleLogout = (event) => {
        localStorage.clear();
    }

    return (
        <header>
            <div id="header-title">
                <h1>Vroom Room</h1>
            </div>

            <div id="header-post">
                <Link className="flex-link" to={"/browse"}>
                    <MagnifyingGlass size={24} weight="bold" />
                    Browse
                </Link>
                <Link className="flex-link" to={!localStorage.getItem('user') ? "/login" : "/post"}>
                    <PlusCircle size={24} weight="bold" />
                    Post
                </Link>
            </div>
            
            <div id="header-login">

                {!localStorage.getItem('user') ? 
                    <></> : 
                    <Link id="profile-link" className="flex-link" to={"/profile/" + localStorage.getItem('user')}>
                        <img id="thumbnail-image" src={getProfileImage()}></img>
                        Profile
                    </Link> }

                {!localStorage.getItem('user') ? 
                    <Link to={"/login"}>Login</Link> : 
                    <Link to={"/login"} onClick={handleLogout} reloadDocument>Logout</Link> }
            </div>
        </header>
    )

}

export default Header