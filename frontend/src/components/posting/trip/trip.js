import "./trip.css"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import DatePicker from "react-multi-date-picker";

import { 
    XmarkCircle,
    CalendarDots,
    PinDestination
 } from "@vectopus/atlas-icons-react";

import { 
    useJsApiLoader, 
    GoogleMap, 
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api';

import TripRoutes from "../../../routes/tripRoutes";
import ProfileRoutes from "../../../routes/profileRoutes";

const google = window.google = window.google ? window.google : {}
const libraries = ['places'];

const Trip = () => {

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

    const [inputList, setInputList] = useState(['']);
    const [wayPointList, setWayPointList] = useState([{location: '', stopover: true}]);
    const [inputTxtList, setInputTxtList] = useState(['']);

    const [dates, setDates] = useState([]);
    const [departTime, setDepartTime] = useState('');
    const [returnTime, setReturnTime] = useState('');

    const [carColor, setCarColor] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carType, setCarType] = useState('');
    const [carPlate, setCarPlate] = useState('');

    const [tripID, setTripID] = useState('');

    const [seatBtn, setSeatBtn] = useState([true, false, false, false, false, false, false]);
    const [luggageBtn, setLuggageBtn] = useState([true, false, false, false]);
    const [otherPref, setOtherPref] = useState([false, false, false, false, false]);

    const [tripDesc, setTripDesc] = useState('');
    const [optimizeWaypoints, setOptimizeWaypoints] = useState(false);

    const navigate = useNavigate();

    // Load initial value if required
    useEffect(() => {

        if (postID) // Editing existing post
        {

            TripRoutes.getTrip({tripID: postID})
            .then((response) => {

                var pageData = response.data;

                setStartPoint(pageData.start);
                setEndPoint(pageData.end);
                setDates([pageData.date]);
                setDepartTime(pageData.depart);
                setReturnTime(pageData.return);
                setCarModel(pageData.model);
                setCarType(pageData.type);
                setCarColor(pageData.color);
                setCarPlate(pageData.plate);
                setLuggageBtn(pageData.luggage);
                setSeatBtn(pageData.seat);
                setOtherPref(pageData.pref);
                setTripDesc(pageData.desc);
                setTripID(pageData.tripID);
                setOptimizeWaypoints(pageData.optimize);

                setInputTxtList(pageData.waypoints.length ? pageData.waypoints : ['']);

                var currWayPointList = pageData.waypoints.map((val, i) => {
                    return {location: val, stopover: true}
                });

                setWayPointList(currWayPointList.length ? currWayPointList : [{location: '', stopover: true}]);

                var currInputList = pageData.waypoints.map((val, i) => {
                    return ''
                });

                setInputList(currInputList.length ? currInputList : ['']);

                setLoadFlag(true);

            }).catch((e) => {
                console.log(e.message);
            })

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

    // ----------------------------------
    // Functions for waypoints for routes
    // ----------------------------------
	const onLoad = (autocomplete, index) => {
		var currArr = [...inputList]
		currArr[index] = autocomplete;
		setInputList(currArr);
	}
    
    // Selection made via drop down
	const onPlaceChanged = (index, e) => {
		if (inputList[index] != null) {
			const place = inputList[index].getPlace();
			const formattedAddress = place.formatted_address;

            var currWaypointList = [...wayPointList];
            var currTxtList = [...inputTxtList];
            currWaypointList[index]['location'] = formattedAddress;
            currTxtList[index] = formattedAddress;
            setWayPointList(currWaypointList);
            setInputTxtList(currTxtList);
		} else {
			alert("Please enter text");
		}
	}

    // Text changed via typing (Don't update waypoint)
    // Act as clearing input
    const handleChange = (index, e) => {

        let currWaypointList = [...wayPointList];
        let currTxtList = [...inputTxtList];
        
        if (currWaypointList[index]['location'] !== '') // Not already empty
        {
            currWaypointList[index]['location'] = '';
            setWayPointList(currWaypointList);
        }

        currTxtList[index] = e.target.value;
        setInputTxtList(currTxtList);
    }   

    // Remove waypoint 
    const handleRemove = (index) => {

        var currWaypointList = [...wayPointList];
        var currTxtList = [...inputTxtList];
        var currInputList = [...inputList];

        if (inputList.length === 1) // Only one waypoint present
        {
            if (wayPointList[0]['location']) // There's something to clear
            {
                currWaypointList[index]['location'] = '';
                currTxtList[index] = '';
                setWayPointList(currWaypointList);
                setInputTxtList(currTxtList);
            }
        }
        else 
        {

            currWaypointList.splice(index , 1);
            currTxtList.splice(index, 1);
            currInputList.splice(index, 1);
            setWayPointList(currWaypointList);
            setInputTxtList(currTxtList);
            setInputList(currInputList);
        }

    }

    // Add waypoint 
    const handleAdd = () => {
        setInputList([...inputList, '']);
        setWayPointList([...wayPointList, {location: '', stopover: true, selected: false}])
        setInputTxtList([...inputTxtList, '']);
    }

    // Display and calculate route on map
    const calculateRoute = useCallback(async() => {

        console.log(optimizeWaypoints);

        // No destination or origin set
        if (originRef.current.value === '' || destinationRef.current.value === '') 
            return

        // Filter valid way points
        var validWayPointList = wayPointList.filter((waypoint) => waypoint.location)

        validWayPointList = validWayPointList.map((waypoint) => {
            return {location: waypoint.location, stopover: true}
        })

        // Retrieve directions
        const directionService = new google.maps.DirectionsService()
        const results = await directionService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: validWayPointList,
            optimizeWaypoints: optimizeWaypoints
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
    }, [wayPointList, optimizeWaypoints])

    useEffect(() => {
        if(originRef.current && destinationRef.current)
            calculateRoute();
    }, [calculateRoute])

    // Return waypoint inputs
    const getWaypoints = () => {
        return (
            <div id="waypoint-inputs">
                {inputList.map((x, i) => {
                    return(
                        <div key={i} className="itinerary waypoint">
                            <PinDestination className="waypoint-svg" size={24}/>
                            <Autocomplete onPlaceChanged={() => onPlaceChanged(i)} onLoad={(e) => onLoad(e, i)}>
                                <input
                                    type="text"
                                    placeholder="Enter a location"
                                    onChange={(e) => handleChange(i, e)}
                                    value={inputTxtList[i] || ''}
                                />
                            </Autocomplete>     
                            <XmarkCircle className="exit-svg" onClick={() => handleRemove(i)} size={24} /> 
                        </div>
                    )
                })}
                <button className="trip-btn" onClick={() => handleAdd()}>Add</button>
            </div>
        )
    }

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

        ProfileRoutes.retrieveProfile({userID: localStorage.getItem("userID")})
        .then(response => {

            // Convert date object into string for database
            var datesAsString = dates.map((date, i) => {
                return date.month.name + " " + date.day + ", " + date.year
            });
            
            // Convert waypoint object into string for database
            var waypointArray = wayPointList.map((waypoint, i) => {
                return waypoint.location
            });

            // Remove empty entries
            waypointArray = waypointArray.filter((waypoint) => waypoint);

            var currName = response.data.firstName + " " + response.data.lastName;

            var newTrip  = {
                start: originRef.current.value, 
                end: destinationRef.current.value,
                waypoints: waypointArray,
                date: datesAsString,
                depart: departTime,
                return: returnTime,
                model: carModel,
                type: carType,
                color: carColor,
                plate: carPlate,
                luggage: luggageBtn,
                seat: seatBtn,
                pref: otherPref,
                desc: tripDesc,
                distance: distance,
                eta: duration,
                name: currName,
                postType: true,
                userID: localStorage.getItem("userID"),
                username: localStorage.getItem("username"),
                optimize: optimizeWaypoints
            }
    
            TripRoutes.createTrip(newTrip)
            .then(response => {
                navigate("/post");
            }).catch(e => {})
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

                // Convert waypoint object into string for database
                var waypointArray = wayPointList.map((waypoint, i) => {
                    return waypoint.location
                });

                // Remove empty entries
                waypointArray = waypointArray.filter((waypoint) => waypoint);
                var currName = response.data.firstName + " " + response.data.lastName;

                var editedTrip  = {
                    start: originRef.current.value, 
                    end: destinationRef.current.value,
                    waypoints: waypointArray,
                    date: datesAsString,
                    depart: departTime,
                    return: returnTime,
                    model: carModel,
                    type: carType,
                    color: carColor,
                    plate: carPlate,
                    luggage: luggageBtn,
                    seat: seatBtn,
                    pref: otherPref,
                    desc: tripDesc,
                    distance: distance,
                    eta: duration,
                    name: currName,
                    postType: true,
                    userID: localStorage.getItem("userID"),
                    tripID: tripID,
                    optimize: optimizeWaypoints
                }
    
                TripRoutes.editTrip(editedTrip)
                .then((response) => {
                    navigate("/history");
                }).catch((e) => {})   
        
            }).catch(e => {});
        }
    }

    const getTimeInHrsMin = (seconds) => {
        return Math.floor(seconds / 3600) + " hrs " + Math.floor((seconds / 60) % 60) + " min";
    }

    const getDistanceInKm = (meter) => {
        return (meter / 1000.0).toFixed(2) + " km"
    }

    const toggleOptimize = (e) => {
        setOptimizeWaypoints(!optimizeWaypoints);
    }

    // Don't page if maps hasn't been loaded successfully 
    if (!isLoaded) {
        return <></>
    }

    return((loadFlag || typeof(postID) === 'undefined' ) ?

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

                    <div id="waypoint-container" className="form-cell">
                        <label>Additional Stops: </label>
                        <div id="optimize-checkbox">
                            <input id="optimize" checked={optimizeWaypoints} onChange={() => toggleOptimize()} type="checkbox"/>
                            <label htmlFor="optimize">Optimize Waypoint</label>
                        </div>
                        {getWaypoints()}
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

            <h4 className="underline">Vehicle Details</h4>

            <div className="form-cell single-line-cell">
                <div className="flex-inline">
                    <label htmlFor="car-model">Model: </label>
                    <input id="car-model" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="e.g. Ford Focus" className="time-picker model-txt"></input>
                </div>

                <div className="flex-inline">
                    <label htmlFor="car-type">Type: </label>
                    <input id="car-type" value={carType} onChange={(e) => setCarType(e.target.value)} className="time-picker model-txt"/>
                </div>
                
                <div className="flex-inline">
                    <label htmlFor="car-color">Color: </label>
                    <input id="car-color" value={carColor} onChange={(e) => setCarColor(e.target.value)} className="time-picker model-txt"/>
                </div>

                <div>
                    <label htmlFor="car-license">License Plate: </label>
                    <input id="car-license" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} placeholder="e.g. ABCD 123" className="time-picker model-txt"></input>
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
                    <h5>Number of Seats:</h5>

                    <div className="form-cell">
                        <div className="selector-container">
                            {getButtons("seat-selector ", seatBtn, setSeatBtn, 
                            [
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7"
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

export default Trip