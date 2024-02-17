import "./register.css"
import React, { useState } from 'react';
import { Link, useOutletContext } from "react-router-dom";

import loginImage from "../../../img/testImage.webp";

import {
    Account,
    Keys
} from '@vectopus/atlas-icons-react';

const Register = (props) => {

    const [userName, setUserName] = useOutletContext();

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    return (
        <div id="login-page">
            
            <div id="login-image">
                <img src={loginImage}></img>
            </div>

            <div id="login-form">
                <div id="login-box">
                    <h2>We're So Excited!</h2>
                    <h4>Create an Account with Us </h4>

                    <div id="login-switch">
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/register"} id="active-button">Sign Up</Link>
                    </div>

                    <div className="login-input-cell">
                        <Account size={24} weight="bold"  />
                        <input id="username-input" className="login-input" onChange={(event) => setUsernameInput(event.target.value)}/>            
                    </div>

                    <div className="login-input-cell">
                        <Keys size={24} weight="bold" />
                        <input type="password" id="password-input" className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                    </div>

                    <Link id="login-submit" to={"/home"} onClick={() => setUserName(usernameInput)}>Register</Link>

                    <Link className="hidden" id="reset-password">Forgot Password?</Link>
                </div>
            </div>
        </div>
    )

}

export default Register