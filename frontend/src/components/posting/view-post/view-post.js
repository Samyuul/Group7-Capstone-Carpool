import "./view-post.css"

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PostTemplate from "../../template/post/postTemplate";

import TripRoutes from "../../../routes/tripRoutes";
import PassengerRoutes from "../../../routes/passengerRoutes";

const ViewPost = () => {

    const { postID } = useParams();
    const [postData, setPostData] = useState({}); 
    const [postFlag, setPostFlag] = useState(false);

    const navigate = useNavigate();

    const getTimeInHrsMin = (seconds) => {
        return Math.floor(seconds / 3600) + " hrs " + Math.floor((seconds / 60) % 60) + " min";
    }

    const getDistanceInKm = (meter) => {
        return (meter / 1000.0).toFixed(2) + " km"
    }

    const joinFutureTrip = () => {

        var userInfo = {
            passengerID: localStorage.getItem("userID"),
            passengerUsername: localStorage.getItem("username").toLowerCase(),
            driverID: postData.userID,
            driverUsername: postData.username,
            tripID: postData.tripID
        }

        PassengerRoutes.joinTrip(userInfo)
        .then((response) => {
            navigate("/browse");
        }).catch((e) => {
            console.log(e.message);
        })
    }

    useEffect(() => {

        TripRoutes.getTrip({tripID: postID})
        .then(response => {
            setPostData(response.data);
            setPostFlag(true);

        }).catch(e => {
            console.log("fail");
        });

    }, [postID])

    return ( 
        
        <> {postFlag ? <div id="view-post-page">
            {<PostTemplate data={postData}/>}

            <div className="view-post-info">
                <p>Estimated Duration: {getTimeInHrsMin(postData.eta)}</p>
                <p>Estimated Distance: {getDistanceInKm(postData.distance)}</p>
            </div>

            <div className="view-post-info">
                <p>Car Model: {postData.model} - {postData.color} {postData.type}</p>
            </div>

            <div className="view-post-info">
                <p>Trip Descrption: {postData.desc}</p>
            </div>

            {!postData.waypoints.length ? <></> :
            <div className="view-post-info">
                <div>Waypoints: {postData.waypoints.map((val, i) => {
                    return (
                        <p className="waypoint-post" key={i}> - {val} </p>
                    )
                })}</div>
            </div>}

            {(postData.userID !== localStorage.getItem("userID") && !postData.seat.every(x => x === false)) ?
            <button className="trip-btn" onClick={() => joinFutureTrip()}>Join This Trip!</button> : <></>}
        </div> : <></>}</>
        
    )

}

export default ViewPost