import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; 

const Private = ({ children }) => {
    const [userName, setUserName] = useState(localStorage.getItem('user'));

    return (
        userName ? <Navigate to={"/Home"} /> : children
    )

}

export default Private