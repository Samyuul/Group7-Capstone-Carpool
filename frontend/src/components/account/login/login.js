import "./login.css"
import React, { useState } from 'react';
import { Link, useOutletContext } from "react-router-dom";

import loginImage from "../../../img/testImage.webp";

import {
    Account,
    Keys
} from '@vectopus/atlas-icons-react';

const Login = (props) => {

    const [userName, setUserName] = useOutletContext();

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleLogin = (event) => {

        const user = { usernameInput, passwordInput };

        setUserName(usernameInput);
        localStorage.setItem('user', usernameInput);
    }

    return (
        <div id="login-page">
            
            <div id="login-image">
                <img src={loginImage}></img>
            </div>

            <div id="login-form">
                <div id="login-box">

                    <h2>Welcome Back</h2>
                    <h4>Sign into your account </h4>

                    <div id="login-switch">
                        <Link to={"/login"} id="active-button">Login</Link>
                        <Link to={"/register"}>Sign Up</Link>
                    </div>

                    <div className="login-input-cell">
                        <Account size={24} weight="bold"  />
                        <input id="username-input" className="login-input" onChange={(event) => setUsernameInput(event.target.value)}/>            
                    </div>

                    <div className="login-input-cell">
                        <Keys size={24} weight="bold" />
                        <input type="password" id="password-input" className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                    </div>

                    <Link id="login-submit" to={"/home"} onClick={handleLogin}>Login</Link>

                    <Link id="reset-password">Forgot Password?</Link>
                </div>
            </div>
        </div>
    )

}

export default Login

