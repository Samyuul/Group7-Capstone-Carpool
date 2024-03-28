import "./register.css"
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import loginImage from "../../../img/testImage.webp";

import AccountRoutes from "../../../routes/accountRoutes";

import {
    Account,
    Keys,
    TriangleExclamation,
    XmarkCircle
} from '@vectopus/atlas-icons-react';

const Register = () => {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const [errorMsg, setErrorMsg] = useState(["", ""]);
    const [errorMsg2, setErrorMsg2] = useState();

    const navigate = useNavigate();

    const registerAccount = (event) => {

        var text_inputs = '';

        event.preventDefault();
        var errorMsgTemp = ["", ""];

        if (usernameInput === "") 
            errorMsgTemp[0] = "Please Enter a Username!"

        if (passwordInput === "") 
            errorMsgTemp[1] = "Please Enter a Password!";

        if (errorMsgTemp.every((x) => x === "") === true)
        {

            var accountData = {
                username: usernameInput,          
                password: passwordInput
            }
    
            AccountRoutes.registerAccount(accountData) 
            .then(response => {
                navigate('/login');
            }).catch (e => {
                console.log(e.message);
                console.log(e.response.data.message);
                setErrorMsg2(e.response.data.message);
            })
            
            // Apply red highlight
            text_inputs = document.getElementsByClassName("login-input-cell")
            text_inputs[0].getElementsByTagName("input")[0].style.border = "none";
            text_inputs[1].getElementsByTagName("input")[0].style.border = "none";
            setErrorMsg(errorMsgTemp);

        }
        else 
        {
            setErrorMsg(errorMsgTemp);
            setErrorMsg2("");

            // Apply red highlight
            text_inputs = document.getElementsByClassName("login-input-cell")

            if(errorMsgTemp[0] !== "")
                text_inputs[0].getElementsByTagName("input")[0].style.border = "2px solid red";
            
            if(errorMsgTemp[1] !== "")
                text_inputs[1].getElementsByTagName("input")[0].style.border = "2px solid red";

        }

    }

    return (
        <div id="login-page">
            
            <div id="login-image">
                <img src={loginImage} alt="login design"></img>
            </div>

            <div id="login-form">
                <div id="login-box">
                    <h2>We're So Excited!</h2>
                    <h4>Create an Account with Us </h4>

                    <div id="login-switch">
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/register"} id="active-button">Sign Up</Link>
                    </div>

                    {errorMsg2 ? 
                    <p className="error-msg-login">
                        {errorMsg2} <XmarkCircle onClick={() => setErrorMsg2("")} size={24} />
                    </p> : <></>}

                    <form onSubmit={registerAccount}>
                    <div className="login-input-cell">
                            <Account className="login-svg" size={24} weight="bold"  />
                            <input id="username-input" className="login-input" onChange={(event) => setUsernameInput(event.target.value)}/>            
                            {errorMsg[0] ? 
                                <div className="error-msg"><TriangleExclamation className="error-svg" size={24}/> <p className="login-error-msg">{errorMsg[0]}</p></div> : ""}
                        </div>

                        <div className="login-input-cell">
                            <Keys className="login-svg" size={24} weight="bold" />
                            <input type="password" id="password-input" className="login-input" onChange={(event) => setPasswordInput(event.target.value)}/>
                            {errorMsg[1] ? 
                                <div className="error-msg"><TriangleExclamation className="error-svg" size={24}/> <p className="login-error-msg">{errorMsg[1]}</p></div> : ""}
                        </div>

                        <button type="submit" className="trip-btn login-submit">Register</button>
                    </form>
                    <Link className="hidden" id="reset-password">Forgot Password?</Link>
                </div>
            </div>
        </div>
    )

}

export default Register