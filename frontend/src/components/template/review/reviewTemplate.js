import "./reviewTemplate.css";

import React from 'react';

import { Star } from "@vectopus/atlas-icons-react";
import { Link } from "react-router-dom";

const ReviewTemplate = (props) => {

    const val = props.data;

    return (
        <> {val ? <> 
            <div className="review">
            <h4><Link to={"/profile/" + val.username} reloadDocument>{val.name}</Link> - <em>{val.type} Review</em></h4>
            <h4 className="review-icon">{val.subject} - {val.rating} / 5<Star size={24}/> </h4>
            <h4>From: {val.start} to {val.end} on {val.date}</h4>
            <p>{val.desc ? val.desc : "..."}</p>
        </div>
        <hr></hr> </>:
        <></>
        }</>
    )

}

export default ReviewTemplate


