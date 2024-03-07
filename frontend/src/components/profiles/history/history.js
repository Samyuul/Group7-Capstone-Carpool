import "./history.css";

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";

const History = (props) => {

    var navigate = useNavigate();

    const test = [{
        start:"Toronto, ON, Canada",
        end:"Burlington, ON, Canada",
        waypoints:["Guelph, ON, Canada"],
        date:["March 14, 2024","March 20, 2024","March 21, 2024"],
        depart:"14:24",
        return:"17:25",
        model:"Ford Focus",
        type:"Hatch Back",
        color:"Red",
        plate:"ABC 1234",
        luggage:[false,false,true,false],
        seat:[false,false,true,false,false,false,false],
        pref:[true,true,true,false,false],
        desc:"This is a test description for entering into the system. Please ignore what this message says.",
        distance:149840,
        eta:7186,
        name:"Sarah Smith",
        tripID:"469ed35b-c8f1-42df-9edb-d83764564acd"}];
    
    const getProfileImage = () => {
        return require('../../../img/thumbnail.webp');
    }

    const getLuggageSize = (arr) => {

        const sizes = ["None", "Small", "Medium", "Large"];
        return("Luggage: " + sizes[arr.indexOf(true)]);
    }

    const getSeat = (arr) => {
        return("Seats Left: " + (arr.indexOf(true) + 1));
    }

    const getPref = (arr) => {
        
        const preferences = ['Winter Tires', 'Bikes', 'Pets', 'Snow Gear', 'Smoking'];

        return (
            arr.map((val, i) => {
                return (<p>{preferences[i]}: {val ? 'Yes' : 'No'}</p>)
            })
        )

    }

    const renderPostings = () => {

        return (
            [0, 1, 2].map((val, i) => {
                return (
                    <div key={i} className="posting" onClick={() => navigate('/post/view/1234')}>
                        <div className="user-info">
                            <img src={getProfileImage()} alt="profile"></img>
                            <div>
                                <p>{test[0].name}</p>
                                <p>4.6 / 5.0 - 7 Driven</p>
                            </div>
                        </div>

                        <div className="trip-info">

                            <p>From: {test[0].start}</p>
                            <p>To: {test[0].end}</p>
                            <p>On: {test[0].date[0]} at {test[0].depart}</p>
                            <br></br>
                            <p>{getLuggageSize(test[0].luggage)}</p>
                            <p>{getSeat(test[0].seat)}</p>
                        </div>

                        <div className="pref-info">
                            <p>Preferences:</p>
                            <br></br>
                            {getPref(test[0].pref)}
                        </div>

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