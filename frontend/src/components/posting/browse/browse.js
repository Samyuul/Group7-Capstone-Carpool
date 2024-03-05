import "./browse.css"
import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";

import { Autocomplete } from "@react-google-maps/api"
import DatePicker from "react-multi-date-picker";

import { 
    XmarkCircle,
    CalendarDots
 } from "@vectopus/atlas-icons-react";

 import waypoint from "../../../img/waypoint.svg";

const Browse = (props) => {

    const [postings, setPostings] = useState(['dafsa', 'davsadd', 'yeays', 'bffr', 'fdasf', 'esfav', 'feavd', 'aewae', 'fdasvd']);

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

    const renderPostings = () => {

        return (
            postings.map((val, i) => {
                return (
                    <div key={i} className="posting">
                        <div id="user-info">

                        </div>

                        <div id="trip-info">

                        <h3>Test {i}</h3>

                            <p>This is a test post</p>
                            <p>Posted by: Bob</p>

                            <Link to={"/post/view/" + val}>
                                View 
                            </Link>
                        </div>

                    </div>
                )
            })
        )
    }
    
    return (
        <div id="browse-page">

            <h2>
                Find a Trip
            </h2>
            <p>
                Enter your starting and ending point and browse away!
            </p>

            <div className="search-bar">
                <div className="flex-inline">
                    <img className="waypoint-svg" src={waypoint}/>
                    <input placeholder="Start"/>
                </div>

                <div className="flex-inline">
                    <img className="waypoint-svg" src={waypoint}/>
                    <input placeholder="End"/>
                </div>

                <div className="flex-inline">
                    <CalendarDots id="calendar-svg" size={24}/>
                    <DatePicker
                        id="date-picker2"
                        format="MMMM DD, YYYY"
                        minDate={new Date()}
                        sort
                        editable={false}
                    />
                </div>

                
                <button id="search-btn" onClick={() => console.log("submit")}>
                    Search
                </button>

            </div>

            {renderPostings()}
        </div>
    )

}

export default Browse