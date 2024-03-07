import "./view-post.css"

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const ViewPost = (props) => {

    const { postID } = useParams();

        const test = {
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
            tripID:"469ed35b-c8f1-42df-9edb-d83764564acd"};
        
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
                <div className="posting">
                    <div className="user-info">
                        <img src={getProfileImage()} alt="profile"></img>
                        <div>
                            <p>{test.name}</p>
                            <p>4.6 / 5.0 - 7 Driven</p>
                        </div>
                    </div>

                    <div className="trip-info">

                        <p>From: {test.start}</p>
                        <p>To: {test.end}</p>
                        <p>On: {test.date} at {test.depart}</p>
                        <br></br>
                        <p>{getLuggageSize(test.luggage)}</p>
                        <p>{getSeat(test.seat)}</p>
                    </div>

                    <div className="pref-info">
                        <p>Preferences:</p>
                        <br></br>
                        {getPref(test.pref)}
                    </div>

                </div>
            )
            
        }

    return (
        <div id="view-post-page">
            {renderPostings()}

            <p id="trip-desc-page">Trip Descrption: {test.desc}</p>

            <button>Join This Trip!</button>
        </div>
    )

}

export default ViewPost