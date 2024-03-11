import "./history.css";

import React, { useState, useRef } from 'react';
import PostTemplate from "../../template/postTemplate";
import { useNavigate } from "react-router-dom";

import data from "./test.json";

const History = (props) => {

    const navigate = useNavigate();

    const renderPostings = () => {

        return (
            data.map((val, i) => {
                return (
                    <div className="history-container" key={i}>
                        <PostTemplate data={val}/>
                        <button onClick={() => navigate('/edit-trip/' + val.tripID)} className="trip-btn">Edit</button>
                    </div>
                )
            })
        )     
    }

    return (
        <div id="history-page">
            <div id="history-nav-bar">
                <button>
                    Trips
                </button>
                <button>
                    Requests
                </button>
                <button>
                    Past
                </button>
            </div>
            <div className="underline"></div>
            {renderPostings()}
        </div>
    )

}

export default History