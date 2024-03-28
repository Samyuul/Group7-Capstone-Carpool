import React from 'react';
import { Navigate } from 'react-router-dom'; 

const Private = ({ children }) => {
    const userName = localStorage.getItem('userID');

    return (
        userName ? children : <Navigate to={"/"} />
    )

}

export default Private