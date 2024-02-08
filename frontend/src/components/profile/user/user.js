import "./user.js"
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const User = (props) => {

    const { username } = useParams();

    return (

        <div>
            {username}
        </div>
    
    )

}

export default User

