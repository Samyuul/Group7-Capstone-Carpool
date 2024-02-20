import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; 

const Private = ({ children }) => {
    const [userName, setUserName] = useState(localStorage.getItem('user'));

    return (
        userName ? children : <Navigate to={"/login"} />
    )

}

export default Private