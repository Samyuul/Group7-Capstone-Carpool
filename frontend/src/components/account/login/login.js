import "./login.css"
import React, { useState } from 'react';
import { Link, useOutletContext, useNavigate } from "react-router-dom";

import loginImage from "../../../img/testImage.webp";

import AccountRoutes from "../../../routes/accountRoutes";

import {
    Account,
    Keys,
    XmarkCircle
} from '@vectopus/atlas-icons-react';

const Login = (props) => {

    const [userName, setUserName] = useOutletContext();
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMsg, setErrorMsg] = useState();
    const navigate = useNavigate();

    const handleLogin = (event) => {

        const userLogin = { 
            username: usernameInput, 
            password: passwordInput 
        };

        console.log(userLogin);

        AccountRoutes.checkLoginInfo(userLogin)
        .then(response => {

            console.log("successful login!");
            console.log(response.data);
            localStorage.setItem('user', usernameInput);
            setUserName(usernameInput);
            navigate('/profile');
            
        }).catch(e => {
            console.log(e.message);
            setErrorMsg("Invalid Login Credentials");
            setPasswordInput("");
        })      
        
        //localStorage.setItem('user', usernameInput);
        //setUserName(usernameInput);
        //navigate('/profile');
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

                    {errorMsg ? 
                    <p className="error-msg-login">
                        {errorMsg} <XmarkCircle onClick={() => setErrorMsg("")} size={24} /> 
                    </p>: <></>}

                    <div className="login-input-cell">
                        <Account size={24} weight="bold" className="login-svg" />
                        <input id="username-input" className="login-input" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)}/>            
                    </div>

                    <div className="login-input-cell">
                        <Keys size={24} weight="bold" className="login-svg" />
                        <input type="password" id="password-input" value={passwordInput} className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                    </div>

                    <button className="trip-btn login-submit" onClick={handleLogin}>Login</button>
                    <Link id="reset-password">Forgot Password?</Link>

                </div>
            </div>
        </div>
    )

}

export default Login

