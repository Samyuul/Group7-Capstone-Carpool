import "./request.css"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import DatePicker from "react-multi-date-picker";

import { 
    CalendarDots,
    PinDestination
 } from "@vectopus/atlas-icons-react";

import { 
    useJsApiLoader, 
    GoogleMap, 
    Autocomplete,
    DirectionsRenderer
} from '@react-google-maps/api';

import ProfileRoutes from "../../../routes/profileRoutes";
import TripRoutes from "../../../routes/tripRoutes";

const google = window.google = window.google ? window.google : {}
const libraries = ['places'];

const Request = () => {

    const { postID } = useParams();
    const [loadFlag, setLoadFlag] = useState(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries
    })

    const [direction, setDirection] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const originRef = useRef();
    const destinationRef = useRef();

    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');

    const [dates, setDates] = useState([]);
    const [departTime, setDepartTime] = useState('');
    const [returnTime, setReturnTime] = useState('');

    const [luggageBtn, setLuggageBtn] = useState([true, false, false, false]);
    const [otherPref, setOtherPref] = useState([false, false, false, false, false]);

    const [tripDesc, setTripDesc] = useState('');
    const [tripID, setTripID] = useState('');

    const navigate = useNavigate();

    // Load initial value if required
    useEffect(() => {

        if(postID) 
        {

            TripRoutes.getTrip({tripID: postID})
            .then((response) => {

                var pageData = response.data;

                setStartPoint(pageData.start);
                setEndPoint(pageData.end);
                setDates([pageData.date]);
                setDepartTime(pageData.depart);
                setReturnTime(pageData.return);
                setLuggageBtn(pageData.luggage);
                setOtherPref(pageData.pref);
                setTripDesc(pageData.desc);
                setTripID(pageData.tripID);
                setDistance(pageData.distance);
                setDuration(pageData.eta);
                setLoadFlag(true);

            }).catch((e) => {})

        }

    }, [postID])

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

    }, [loadFlag])

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

        // Convert date object into string for database
        var datesAsString = dates.map((date, i) => {
            return date.month.name + " " + date.day + ", " + date.year
        });
        
        ProfileRoutes.retrieveProfile({userID: localStorage.getItem("userID")})
        .then(response => {
            var currName = response.data.firstName + " " + response.data.lastName;

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
                name: currName,
                postType: false,
                userID: localStorage.getItem("userID")
            }
    
            TripRoutes.createTrip(newTrip)
            .then(response => {
                navigate("/post");
            })
    
        }).catch(e => {});

    }

    const editTrip = () => {

        if(dates.length === 1) // Only allow single selection for date
        {
            ProfileRoutes.retrieveProfile({userID: localStorage.getItem("userID")})
            .then(response => {

                var datesAsString = "";

                if (typeof(dates[0]) == "string") // No new selection made
                    datesAsString = dates;
                else                              // Convert date input into string
                    datesAsString = [dates[0].month.name + " " + dates[0].day + ", " + dates[0].year];

                var currName = response.data.firstName + " " + response.data.lastName;

                var editedTrip  = {
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
                    name: currName,
                    postType: false,
                    userID: localStorage.getItem("userID"),
                    tripID: tripID
                }
    
                TripRoutes.editTrip(editedTrip)
                .then((response) => {
                    navigate("/history");
                })
        
            }).catch(e => {});
        }
    }

    const getTimeInHrsMin = (seconds) => {
        return Math.floor(seconds / 3600) + " hrs " + Math.floor((seconds / 60) % 60) + " min";
    }

    const getDistanceInKm = (meter) => {
        return (meter / 1000.0).toFixed(2) + " km"
    }

    // Don't page if maps hasn't been loaded successfully 
    if (!isLoaded) {
        return <></>
    }

    return ((loadFlag || typeof(postID) === 'undefined' ) ?
        <div id="trip-page">
            
            <h2 className="underline">Post Your Trip!</h2>

            <h4 className="first-title underline">Planned Route</h4>
            
            <div className="itinerary-info">
                <div className="travel-info">
                    <h5>Itinerary</h5>
                    <p>Choose your starting and ending positions, with any stops along the way.</p>
            
                    <div className="form-cell itinerary dest">
                        <label htmlFor="start-point">Starting Point: </label>

                        <PinDestination className="waypoint-svg" size={24}/>
                        <Autocomplete onPlaceChanged={calculateRoute} className="flex-input">
                            <input defaultValue={startPoint} id="start-point" ref={originRef}/>
                        </Autocomplete>
                    </div>

                    <div className="form-cell itinerary dest">
                        <label htmlFor="end-point">Destination: </label>
                        <PinDestination className="waypoint-svg" size={24}/>
                        <Autocomplete onPlaceChanged={calculateRoute} className="flex-input">
                            <input defaultValue={endPoint} id="end-point" ref={destinationRef}/>
                        </Autocomplete>
                    </div>

                    <div>
                        {distance ? <p> Estimated Distance: {getDistanceInKm(distance)} </p> :  <></>}
                        {duration ? <p> Estimated Time: {getTimeInHrsMin(duration)} </p> : <></>}
                    </div>
                </div>

                <div className="google-map">
                {direction ? 
                        <GoogleMap
                            mapContainerStyle={{width: '100%', height: '100%'}}>
                            <DirectionsRenderer directions={direction}/>   
                        </GoogleMap>:
                        <GoogleMap                        
                            zoom={3} 
                            mapContainerStyle={{width: '100%', height: '100%'}}
                            center={{lat: 54.5260, lng: -105.2551}}>
                        </GoogleMap>}
                </div>
            </div>

            <h4 className="underline">Departure Time</h4>
            <p className="trip-desc-txt">
                Please enter the date(s) of your trip (up to a total of 5 if necessary). Along with
                a departure time and a return time if applicable.
            </p>
            
            <div className="form-cell single-line-cell">
                <div className="flex-inline">
                    <label htmlFor="date-picker-trip">Date: </label>
                    <CalendarDots className="calendar-svg" size={24}/>
                    <DatePicker
                        id="date-picker-trip"
                        value={dates}
                        onChange={limitSetDates}
                        format="MMMM DD, YYYY"
                        minDate={new Date()}
                        sort
                        editable={false}
                    />
                </div>

                <div className="flex-inline">
                    <label htmlFor="depart-time">Departure Time:</label>
                    <input id="depart-time" value={departTime} onChange={(e) => setDepartTime(e.target.value)} className="time-picker" type="time"></input>
                </div>

                <div className="flex-inline">
                    <label htmlFor="return-time">Return Time (Optional):</label>
                    <input id="return-time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="time-picker" type="time"></input>
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
                                "No Smoking"
                            ])}
                        </div>
                    </div>
                </div>

            </div>

            <h4 className="underline">Trip Description</h4>
            <div className="form-cell">
                <label htmlFor="trip-desc-input">Description: </label>
                <div className="textarea-container">
                    <textarea value={tripDesc} onChange={(e) => setTripDesc(e.target.value)} id="trip-desc-input"/>
                </div>
            </div>

            <h4 className="underline">Rules</h4>
            <div className="form-cell flex-inline">
                <input id="tos" type="checkbox"></input>
                <label htmlFor="tos">
                    I agree to the rules, and I understand that my account can be suspended
                    if any of these rules are broken. 
                </label>
            </div>
            <button className="trip-btn btn-spacing" onClick={postID ? editTrip : submitTrip}>
                Submit
            </button>
        </div> : <></>
    )

}

export default Request