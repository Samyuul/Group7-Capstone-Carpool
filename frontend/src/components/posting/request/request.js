import "./request.css"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

import { 
    XmarkCircle,
    CalendarDots
 } from "@vectopus/atlas-icons-react";

import waypoint from "../../../img/waypoint.svg";

import { 
    useJsApiLoader, 
    GoogleMap, 
    Marker, 
    Autocomplete,
    DirectionsRenderer
} from '@react-google-maps/api';

const google = window.google = window.google ? window.google : {}
const libraries = ['places'];

const Request = (props) => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //googleMapsApiKey: "",
        libraries
    })

    const [map, setMap] = useState(null);
    const [direction, setDirection] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const originRef = useRef();
    const destinationRef = useRef();

    const [dates, setDates] = useState([]);
    const [departTime, setDepartTime] = useState('');
    const [returnTime, setReturnTime] = useState('');

    const [luggageBtn, setLuggageBtn] = useState([true, false, false, false]);
    const [otherPref, setOtherPref] = useState([false, false, false, false, false]);

    const [tripDesc, setTripDesc] = useState('');

// ---------------------------------------
    // Functions for waypoints for preferences
    // ---------------------------------------

    // Update current selector (achieve radio button effect)
    const setSelector = (index, size, setFunc) => {
        var newSelectArr = Array.from({length: size}, () => false);
        newSelectArr[index] = true;
        setFunc(newSelectArr);
    }

    // Individual toggle for each button
    const toggleOtherPref = (index) => {
        var newSelectArr = [...otherPref];
        newSelectArr[index] = !newSelectArr[index];
        setOtherPref(newSelectArr); 
    }

    // Limit date selection to 5
    const limitSetDates = (val) => {
        if (val.length < 6)
        {
            setDates(val);
        }
        else 
        {
            
            val.splice(4, 1);
            setDates(val);
        }
    }

    
    // Display and calculate route on map
    const calculateRoute = useCallback(async() => {
        // No destination or origin set
        if (originRef.current.value === '' || destinationRef.current.value === '') 
            return

        // Retrieve directions
        const directionService = new google.maps.DirectionsService()
        const results = await directionService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
        })

        // Calculate distance and estimated time 
        var estimatedRoute = results.routes[0].legs;
        var legs = results.routes[0].legs;
        var estimatedDistance = 0.0;
        var estimatedDuration = 0.0;

        for (var i = 0 ; i < legs.length; i++)
        {
        estimatedDistance = estimatedDistance + legs[i].distance.value;
        estimatedDuration = estimatedDuration + legs[i].duration.value;
        }

        setDirection(results);
        setDistance(estimatedDistance);
        setDuration(estimatedDuration);
    }, [])

    useEffect(() => {
        if(originRef.current && destinationRef.current)
            calculateRoute();
    }, [calculateRoute])

    // Return buttons for specific preferences 
    const getButtons = (btnName, btnArray, setBtnArray, btnTxt) => {

        return (
            btnArray.map((val, i) => {

                return (
                    <button 
                        key={i} 
                        className={"selector " + btnName + (val ? "current-selector " : "")
                            + (i === 0 ? "selector-left" : "") 
                            + (i === (btnArray.length - 1) ? "selector-right" : "")} 
                        onClick={() => (
                            btnName === "pref-selector ") ?
                            toggleOtherPref(i) :
                            setSelector(i, btnArray.length, setBtnArray)}>
                        {btnTxt[i]}
                    </button>
                )
            })
        )
    }

    const submitTrip = () => {
        console.log("submitTrip");

        // Convert date object into string for database
        var datesAsString = dates.map((date, i) => {
            return date.month.name + " " + date.day + ", " + date.year
        });
        
        var newTrip  = {
            start: originRef.current.value, 
            end: destinationRef.current.value,
            date: datesAsString,
            depart: departTime,
            return: returnTime,
            luggage: luggageBtn,
            pref: otherPref,
            desc: tripDesc,
            distance: distance,
            eta: duration,
            name: "Sarah Smith",
            tripID: uuidv4()
        }

    }

    const getTimeInHrsMin = (seconds) => {
        return Math.floor(seconds / 3600) + " hrs " + Math.floor((seconds / 60) % 60) + " min";
    }

    const getDistanceInKm = (meter) => {
        return (meter / 1000.0).toFixed(2) + " km"
    }

    const colorOption = [
        "Red",
        "Black",
        "White",
        "Silver",
        "Light Gray",
        "Dark Gray",
        "Blue",
        "Green"
    ]

    return (
        <div id="request-page">

            <h2 className="underline">Post Your Request!</h2>

            <h4 className="first-title underline">Planned Route</h4>

            <div className="itinerary-info">
                <div className="travel-info">
                    <h5>Itinerary</h5>
                    <p>Choose your starting and ending positions.</p>

                    <div className="form-cell itinerary dest">
                        <label>Starting Point: </label>

                        <img className="waypoint-svg" src={waypoint}/>
                        <Autocomplete onPlaceChanged={calculateRoute} className="flex-input">
                            <input ref={originRef}/>
                        </Autocomplete>
                    </div>

                    <div className="form-cell itinerary dest">
                        <label>Destination: </label>
                        <img className="waypoint-svg" src={waypoint}/>
                        <Autocomplete onPlaceChanged={calculateRoute} className="flex-input">
                            <input ref={destinationRef}/>
                        </Autocomplete>
                    </div>

                    <div>
                        {distance ? <p> Estimated Distance: {getDistanceInKm(distance)} </p> :  <></>}
                        {duration ? <p> Estimated Time: {getTimeInHrsMin(duration)} </p> : <></>}
                    </div>
                </div>

                <div className="google-map">
                    <GoogleMap 
                        zoom={15} 
                        mapContainerStyle={{width: '100%', height: '100%'}}
                        onLoad={(map) => setMap(map)}>
                        {direction ? <DirectionsRenderer directions={direction}/> : <></>}
                    </GoogleMap>
                </div>
            </div>

            <h4 className="underline">Departure Time</h4>
            <p className="trip-desc-txt">
                Please enter the date(s) of your request (up to a total of 5 if necessary). Along with
                a departure time and a return time if applicable.
            </p>
            <div className="form-cell single-line-cell">
                <div className="flex-inline">
                    <label>Date: </label>
                    <CalendarDots className="calendar-svg" size={24}/>
                    <DatePicker
                        id="date-picker-request"
                        value={dates}
                        onChange={limitSetDates}
                        format="MMMM DD, YYYY"
                        minDate={new Date()}
                        sort
                        editable={false}
                    />
                </div>

                <div className="flex-inline">
                    <label>Departure Time:</label>
                    <input onChange={(e) => setDepartTime(e.target.value)} className="time-picker" type="time"></input>
                </div>

                <div className="flex-inline">
                    <label>Return Time (Optional):</label>
                    <input onChange={(e) => setReturnTime(e.target.value)} className="time-picker" type="time"></input>
                </div>
            </div>

            <h4 className="underline">Preferences</h4>
            <div className="preference-section">

                <div className="preference-cell">
                    <h5>Luggage: </h5>
                    <div className="form-cell">
                        <div className="selector-container">
                            {getButtons("luggage-selector ", luggageBtn, setLuggageBtn, 
                                [
                                    "None",
                                    "Small",
                                    "Medium",
                                    "Large",
                                ])}
                        </div>
                    </div>

                    <h5>Others:</h5>

                    <div className="form-cell">
                        <div className="selector-container">
                            {getButtons("pref-selector ", otherPref, setOtherPref,
                            [
                                "Winter Tires",
                                "Bikes",
                                "Pets",
                                "Snow Gear",
                                "Smoking"
                            ])}
                        </div>
                    </div>

                </div>

            </div>

            <h4 className="underline">Request Description</h4>
                <div onChange={(e) => setTripDesc(e.target.value)} className="form-cell">
                    <label>Description: </label>
                    <textarea/>
                </div>

            <h4 className="underline">Rules</h4>
            <div className="form-cell flex-inline">
                <input id="tos" type="checkbox"></input>
                <label htmlFor="tos">
                    I agree to the rules, and I understand that my account can be suspended
                    if any of these rules are broken. 
                </label>
            </div>
            <button className="trip-btn btn-spacing" onClick={submitTrip}>
                Submit
            </button>
        </div>
    )

}

export default Request