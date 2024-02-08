import "./register.css"
import React, { useState } from 'react';
import { Link, useOutletContext } from "react-router-dom";

const Register = (props) => {

    const [userName, setUserName] = useOutletContext();

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    return (
        <div id="login-page">
            
            <div id="login-image">
                STOCK IMAGE
            </div>

            <div id="login-form">
                <div id="login-box">
                    <h2>Sign up </h2>
                    <h4>Sign up here! </h4>

                    <div className="login-input-cell">
                        <label htmlFor="username-input">Email: *</label>
                        <input id="username-input" className="login-input" onChange={(event) => setUsernameInput(event.target.value)}/>            
                    </div>

                    <div className="login-input-cell">
                        <label htmlFor="password-input">Password: *</label>
                        <input id="password-input" className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                    </div>

                    <Link id="login-submit" to={"/home"} onClick={() => setUserName(usernameInput)}>Submit</Link>

                </div>
            </div>
        </div>
    )

}

export default Register