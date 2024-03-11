import "./view-post.css"

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

import PostTemplate from "../../template/postTemplate";

const ViewPost = (props) => {

    const { postID } = useParams();

    const postData = {
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

    const getTimeInHrsMin = (seconds) => {
        return Math.floor(seconds / 3600) + " hrs " + Math.floor((seconds / 60) % 60) + " min";
    }

    const getDistanceInKm = (meter) => {
        return (meter / 1000.0).toFixed(2) + " km"
    }

    return (
        <div id="view-post-page">
            {<PostTemplate data={postData}/>}

            <div className="trip-desc-page">
                <p>Estimated Duration: {getTimeInHrsMin(postData.eta)}</p>
                <p>Estimated Distance: {getDistanceInKm(postData.distance)}</p>
            </div>

            <div className="car-info">
                <p>Car Model: {postData.model} - {postData.type}</p>
            </div>

            <p className="trip-desc-page">Trip Descrption: {postData.desc}</p>

            <button className="trip-btn">Join This Trip!</button>
        </div>
    )

}

export default ViewPost