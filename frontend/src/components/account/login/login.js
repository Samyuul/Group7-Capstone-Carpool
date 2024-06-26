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

const Login = () => {

    // eslint-disable-next-line
    const [userName, setUserName] = useOutletContext();
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMsg, setErrorMsg] = useState();
    const navigate = useNavigate();

    const handleLogin = (event) => {

        event.preventDefault();

        const userLogin = { 
            username: usernameInput, 
            password: passwordInput 
        };

        AccountRoutes.checkLoginInfo(userLogin)
        .then(response => {
            localStorage.setItem('userID', response.data.userID);
            localStorage.setItem('AuthKey', response.data.authKey);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('profileImage', response.data.profileImage);
            setUserName(usernameInput);
            navigate('/profile');
            
        }).catch(e => {
            setErrorMsg("Invalid Login Credentials");
            setPasswordInput("");
        });      
        
    }

    return (
        <div id="login-page">
            
            <div id="login-image">
                <img src={loginImage} alt="login design"></img>
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

                    <form onSubmit={handleLogin}>

                        <div className="login-input-cell">
                            <Account size={24} weight="bold" className="login-svg" />
                            <input id="username-input" className="login-input" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)}/>            
                        </div>

                        <div className="login-input-cell">
                            <Keys size={24} weight="bold" className="login-svg" />
                            <input type="password" id="password-input" value={passwordInput} className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                        </div>

                        <button type="submit" className="trip-btn login-submit" >Login</button>
                    </form>

                    <Link id="reset-password">Forgot Password?</Link>

                </div>
            </div>
        </div>
    )

}

export default Login

