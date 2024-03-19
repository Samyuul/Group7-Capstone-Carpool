import React from 'react';

import { Star } from "@vectopus/atlas-icons-react";
import { Link } from 'react-router-dom';

const AltReviewTemplate = (props) => {

    const val = props.data;

    return (
        <> {val ? <> 
            <div className="review">
                <h4><Link to={"/profile/" + val.subjectUsername} reloadDocument>{val.subjectName} ({val.subjectUsername})</Link> - <em>{val.type} Review</em></h4>
                <h4 className="review-icon">{val.subject} - {val.rating} / 5<Star size={24}/> </h4>
                <h4>From: {val.start} to {val.end} on {val.date}</h4>
                <p>{val.desc ? val.desc : "..."}</p>
            </div> </>:
        <></>
        }</>
    )

}

export default AltReviewTemplate


