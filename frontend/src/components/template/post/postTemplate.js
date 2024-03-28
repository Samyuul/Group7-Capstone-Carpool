import "./postTemplate.css";

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { 
    Ski,
    BikeBicycle,
    Pets,
    NoSmoking,
    ColdSnowflake,
    Baggage,
    CinemaChair,
    Star,
    Account
 } from "@vectopus/atlas-icons-react";

import StatisticsRoutes from "../../../routes/statisticsRoutes";
import ProfileRoutes from "../../../routes/profileRoutes";

const PostTemplate = (props) => {

    const val = props.data;
    const clickable = props.clickable;

    const [rating, setRating] = useState("");
    const [numTrips, setNumTrips] = useState("");   
    const [profileImage, setProfileImage] = useState("");

    let navigate = useNavigate();

    const getProfileImage = () => {
        return profileImage;
    }
    const getLuggageSize = (arr) => {

        const sizes = ["N", "S", "M", "L"];
        return("Luggage: " + sizes[arr.indexOf(true)]);
    }

    const getSeat = (arr) => {
        return("Seats Left: " + (arr.indexOf(true) + 1));
    }

    const getPref = (arr) => {
        
        const preferences = ['Winter Tires', 'Bikes', 'Pets', 'Snow Gear', 'No Smoking'];

        const symbols = [
            <ColdSnowflake size={24}/>,
            <BikeBicycle size={24}/>, 
            <Pets size={24}/>,
            <Ski size={24}/>,
            <NoSmoking size={24} />
        ];

        return (
            arr.map((val, i) => {
                return (<div className={"pref-symbol " + (val ? "pref-true" : "pref-false")} key={i}>
                    {symbols[i]}<p>{preferences[i]}</p></div>)
            })
        )
    }

    const clickProfile = (e, username) => {
        e.stopPropagation();
        navigate("/profile/" + username);
        window.location.reload();
    }

    useEffect(() => {

        async function loadData() {
            await StatisticsRoutes.retrieveStatistics({userID: val.userID})
            .then((response) => {
                // console.log(response.data);
    
                if(val.postType) // Driver post
                {
                    setRating(response.data.driverRating < 0 ? "N.A" : response.data.driverRating);
                    setNumTrips(response.data.tripDriver + " Driven");
                }
                else // Passenger Request 
                {
                    setRating(response.data.passengerRating < 0 ? "N.A" : response.data.passengerRating);
                    setNumTrips(response.data.tripPassenger + " Ridden");
                }
                
    
            }).catch((err) => {
                console.log(err.message);
            })

            await ProfileRoutes.getProfileImage({userID: val.userID})
            .then((response) => {
                setProfileImage(response.data);
            }).catch((err) => {
                console.log(err.message);
            })
            
        }

        loadData();


    }, [val])

    return (
        <div className={"posting " + (val.postType ? "trip-posting" : "request-posting")}  onClick={() => clickable ? navigate('/post/view/' + val.tripID) : {}}>
            <div className="user-info" onClick={(e) => clickProfile(e, val.username)}>
                <img src={getProfileImage()} alt="profile"></img>
                <div className="user-info-txt">
                    <div className="pref-symbol"><Account size={24} /><p>{val.name}</p></div>
                    <div className="pref-symbol"><Star size={24}/><p>{rating} / 5.0 - {numTrips}</p></div>
                </div>
            </div>

            <div className="trip-info">

                <div className="schedule">
                    <p>From: {val.start}</p>
                    <p>To: {val.end}</p>
                    <p>On: {val.date} at {val.depart}</p>
                </div>

                <div className="pref-symbol"><Baggage size={24}/>{getLuggageSize(val.luggage)}</div>
                {val.postType ? <div className="pref-symbol"><CinemaChair size={24}/><p>{getSeat(val.seat)}</p></div> : <></>}
            </div>

            {
                val.postType ? 
                <div className="pref-info">
                    {getPref(val.pref)}
                </div> : <></>
            }

        </div>
    )

}

export default PostTemplate