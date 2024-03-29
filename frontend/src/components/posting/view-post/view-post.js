import "./view-post.css"

import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import PostTemplate from "../../template/post/postTemplate";

import TripRoutes from "../../../routes/tripRoutes";
import PassengerRoutes from "../../../routes/passengerRoutes";

const ViewPost = () => {

    const { postID } = useParams();
    const [postData, setPostData] = useState({}); 
    const [postFlag, setPostFlag] = useState(false);
    const [postFlag2, setPostFlag2] = useState(false);
    const [passengerData, setPassengerData] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

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
            setErrorMsg("Already Joined!");
        });
    }

    useEffect(() => {

        async function loadData() {

            await TripRoutes.getTrip({tripID: postID})
            .then((response) => {
                setPostData(response.data);
                setPostFlag(true);
            }).catch(e => {});
    
            await PassengerRoutes.viewPassengers({tripID: postID})
            .then((response) => {
                setPassengerData(response.data);
                setPostFlag2(true);
            }).catch(e => {});

        }

        loadData();

    }, [postID])

    return ( 
        
        <> {postFlag && postFlag2 ? <div id="view-post-page">
            {<PostTemplate data={postData}/>}

            <div className="flex-double-container">

                <div className="view-post-info">
                    <p>Estimated Duration: {getTimeInHrsMin(postData.eta)}</p>
                    <p>Estimated Distance: {getDistanceInKm(postData.distance)}</p>
                </div>

                {postData.model ? 
                <div className="view-post-info">
                    <p>Car Model: {postData.model} - {postData.color} {postData.type}</p>
                </div> : <></>}
            </div>

            <div className="view-post-info">
                <p>Trip Descrption: {postData.desc ? postData.desc : "..."}</p>
            </div>

            <div className="flex-double-container">

                {postData.waypoints && postData.waypoints.length !== 0 ? 
                <div className="view-post-info">
                    <div>Waypoints: {postData.waypoints.map((val, i) => {
                        return (
                            <p className="waypoint-post" key={i}> - {val} </p>
                        )
                    })}</div>
                </div> : <></>}

                {passengerData.passengerName && passengerData.passengerName.length !== 0? <div className="view-post-info">
                    <div>Passengers: {passengerData.passengerName.map((val, i) => {
                        return (
                            <Fragment key={i}>
                                {i ? ", ": ""}<Link to={"/profile/" + passengerData.passengerUsername[i]} className="waypoint-post" key={i}> {val}</Link> 
                            </Fragment>
                        )
                    })}</div>
                </div> : <></>}

            </div>

            {(postData.userID !== localStorage.getItem("userID") && !postData.seat.every(x => x === false)) ?
            <button className="trip-btn" onClick={() => joinFutureTrip()}>Join This Trip!</button> : <></>}
        
            {errorMsg ? <p>{errorMsg}</p> : <></>}
        
        </div> : <></>}</>
        
    )

}

export default ViewPost