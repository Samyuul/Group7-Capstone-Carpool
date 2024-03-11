import "./postTemplate.css";

import React from 'react';
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

const PostTemplate = (props) => {

    const val = props.data;

    let navigate = useNavigate();

    const getProfileImage = () => {
        return require('../../img/thumbnail.webp');
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


    return (
        <div className="posting" onClick={() => navigate('/post/view/' + val.tripID)}>
            <div className="user-info">
                <img src={getProfileImage()} alt="profile"></img>
                <div className="user-info-txt">
                    <div className="pref-symbol"><Account size={24} /><p>{val.name}</p></div>
                    <div className="pref-symbol"><Star size={24}/><p>4.6 / 5.0 - 7 Driven</p></div>
                </div>
            </div>

            <div className="trip-info">

                <div className="schedule">
                    <p>From: {val.start}</p>
                    <p>To: {val.end}</p>
                    <p>On: {val.date[0]} at {val.depart}</p>
                </div>

                <div className="pref-symbol"><Baggage size={24}/>{getLuggageSize(val.luggage)}</div>
                <div className="pref-symbol"><CinemaChair size={24}/><p>{getSeat(val.seat)}</p></div>
            </div>

            <div className="pref-info">
                {getPref(val.pref)}
            </div>

        </div>
    )

}

export default PostTemplate