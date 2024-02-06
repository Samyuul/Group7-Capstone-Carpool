import "./header.css"
import React, { useState } from 'react';

const Header = (props) => {

    return (
        <header>
            <div id="header-post">
                <a href="/browse">Browse</a>
                <a href="/post">Post</a>
            </div>

            <div id="header-title">
                <h1>Vroom Room</h1>
            </div>
            
            <div id="header-login">
                <a href="/login">Login</a>
            </div>
        </header>
    )

}

export default Header