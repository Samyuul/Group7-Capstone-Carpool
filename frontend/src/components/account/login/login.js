import "./login.css"
import React, { useState } from 'react';
import { Link, useOutletContext } from "react-router-dom";
import axios from 'axios';

import {
	Header,
	Footer,
} from "./../../"

const Login = (props) => {

    const [userName, setUserName] = useOutletContext();

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleLogin = async event => {

        event.preventDefault();
        const user = { usernameInput, passwordInput };

        setUserName(usernameInput);
        
        localStorage.setItem('user', usernameInput);
        console.log(localStorage.getItem('user'));
    }

    return (
        <div id="login-page">
            
            <div id="login-image">
                STOCK IMAGE
            </div>

            <div id="login-form">
                <div id="login-box">
                    <h2>Welcome Back</h2>
                    <h4>Sign into your account </h4>

                    <div className="login-input-cell">
                        <label htmlFor="username-input">Email: *</label>
                        <input id="username-input" className="login-input" onChange={(event) => setUsernameInput(event.target.value)}/>            
                    </div>

                    <div className="login-input-cell">
                        <label htmlFor="password-input">Password: *</label>
                        <input id="password-input" className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                    </div>

                    <Link id="login-submit" to={"/login"} onClick={handleLogin}>Login</Link>

                    <p>Don't have an account? <Link to={"/register"}>Register Here</Link></p>
                </div>
            </div>
        </div>
    )

}

export default Login

