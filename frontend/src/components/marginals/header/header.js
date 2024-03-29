import "./header.css"
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AccountRoutes from "../../../routes/accountRoutes";

import { 
    PlusCircle, 
    MagnifyingGlass
} from '@vectopus/atlas-icons-react';

const Header = () => {

    const navigate = useNavigate();

    const getProfileImage = () => {
        return localStorage.getItem("profileImage") ? localStorage.getItem("profileImage") : require("../../../img/Default_pfp.jpg");
    }

    async function handleLogout() {

        await AccountRoutes.logoutSession({userID: localStorage.getItem("userID")})
        .then(async (response) => {

            await localStorage.clear();
            navigate("/login");

        }).catch(e => {});      
        
    }

    return (
        <header>
            <div id="header-title">
                <h1>Vroom Room</h1>
            </div>

            <div id="header-post">
                <Link to={"/browse"}>
                    <MagnifyingGlass size={24} weight="bold" />
                    Browse
                </Link>
                <Link to={!localStorage.getItem('userID') ? "/" : "/post"}>
                    <PlusCircle size={24} weight="bold" />
                    Post
                </Link>
            </div>
            
            <div id="header-login">

                {!localStorage.getItem('userID') ? 
                        <></> : 
                        <Link className="flex-link" to={"/history"}>
                            History
                        </Link> }

                {!localStorage.getItem('userID') ? 
                    <></> : 
                    <Link id="profile-link" to={"/profile/"} >
                        <img id="thumbnail-image" src={getProfileImage()} alt="profile"></img>
                        Profile
                    </Link> }

                {!localStorage.getItem('userID') ? 
                    <Link to={"/"} className="flex-link">Login</Link> : 
                    // eslint-disable-next-line
                    <a tabIndex={0} onClick={handleLogout} className="flex-link" >Logout</a> }
            </div>
        </header>
    )

}

export default Header