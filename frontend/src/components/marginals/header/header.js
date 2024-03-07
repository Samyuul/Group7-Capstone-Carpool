import "./header.css"
import React from 'react';
import { Link } from 'react-router-dom';

import { 
    PlusCircle, 
    MagnifyingGlass
} from '@vectopus/atlas-icons-react';

const Header = (props) => {

    const getProfileImage = () => {
        return require('../../../img/thumbnail.webp');
    }

    const handleLogout = (event) => {
        localStorage.clear();
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
                <Link to={!localStorage.getItem('user') ? "/login" : "/post"}>
                    <PlusCircle size={24} weight="bold" />
                    Post
                </Link>
            </div>
            
            <div id="header-login">

                {!localStorage.getItem('user') ? 
                        <></> : 
                        <Link className="flex-link" to={"/history"}>
                            History
                        </Link> }

                {!localStorage.getItem('user') ? 
                    <></> : 
                    <Link id="profile-link" to={"/profile/"}>
                        <img id="thumbnail-image" src={getProfileImage()} alt="profile"></img>
                        Profile
                    </Link> }

                {!localStorage.getItem('user') ? 
                    <Link to={"/login"} className="flex-link">Login</Link> : 
                    <Link to={"/login"} className="flex-link" onClick={handleLogout} reloadDocument>Logout</Link> }
            </div>
        </header>
    )

}

export default Header