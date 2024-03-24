import "./header.css"
import React from 'react';
import { Link } from 'react-router-dom';

import AccountRoutes from "../../../routes/accountRoutes";

import { 
    PlusCircle, 
    MagnifyingGlass
} from '@vectopus/atlas-icons-react';

const Header = (props) => {

    const getProfileImage = () => {
        return require('../../../img/head.webp');
    }

    async function handleLogout() {

        await AccountRoutes.logoutSession({userID: localStorage.getItem("userID")})
        .then(async (response) => {

            await localStorage.clear();
            await window.location.reload();
            
        }).catch(e => {
            console.log(e.message);

        });      
        
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
                <Link to={!localStorage.getItem('userID') ? "/login" : "/post"}>
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
                    <Link id="profile-link" to={"/profile/"} reloadDocument>
                        <img id="thumbnail-image" src={getProfileImage()} alt="profile"></img>
                        Profile
                    </Link> }

                {!localStorage.getItem('userID') ? 
                    <Link to={"/login"} className="flex-link">Login</Link> : 
                    <Link className="flex-link" onClick={handleLogout} >Logout</Link> }
            </div>
        </header>
    )

}

export default Header