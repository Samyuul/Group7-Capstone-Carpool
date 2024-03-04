import "./trip.css"
import React, { useState, useRef } from 'react';

import { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

import { 
    useJsApiLoader, 
    GoogleMap, 
    Marker, 
    Autocomplete,
    DirectionsRenderer
} from '@react-google-maps/api';

const google = window.google = window.google ? window.google : {}
const libraries = ['places'];

const Trip = (props) => {

    const { isLoaded  } = useJsApiLoader({
        //googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        googleMapsApiKey: "",
        libraries
    })

    const [map, setMap] = useState(null);
    const [direction, setDirection] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const originRef = useRef();
    const destinationRef = useRef();
    const waypointRef = useRef(['']);

    const [inputList, setInputList] = useState(['']);
    const [wayPointList, setWayPointList] = useState([{location: '', stopover: true, selected: false}]);

    const [seatBtn, setSeatBtn] = useState([true, false, false, false, false, false, false]);
    const [luggageBtn, setLuggageBtn] = useState([true, false, false, false]);
    const [otherPref, setOtherPref] = useState([false, false, false, false, false]);
    const [dates, setDates] = useState([]);

    const [searchResult, setSearchResult] = useState("Result: none");

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

            var currList = [...wayPointList]
            currList[index]['location'] = formattedAddress;
            currList[index]['selected'] = true;
            setWayPointList(currList);

		} else {
			alert("Please enter text");
		}
	}

    // Text changed via typing
    const handleChange = (index, e) => {
        let currList = [...wayPointList];
        currList[index]['location'] = e.target.value;
        currList[index]['selected'] = false;
        setWayPointList(currList);
    }   

    // Remove waypoint 
    const handleRemove = (index) => {
        var currList = [...wayPointList];
        var currInputList = [...inputList];
        currList.splice(index , 1);
        currInputList.splice(index, 1);
        setWayPointList(currList);
        setInputList(currInputList);
    }

    // Add waypoint 
    const handleAdd = () => {
        setInputList([...inputList, '']);
        setWayPointList([...wayPointList, {location: '', stopover: true, selected: false}])
    }

    // Display and calculate route on map
    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') 
            return

        var validWayPointList = wayPointList.filter((waypoint) => waypoint.selected === true)

        validWayPointList = validWayPointList.map((waypoint) => {
            return {location: waypoint.location, stopover: true}
        })

        const directionService = new google.maps.DirectionsService()
        const results = await directionService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: validWayPointList
        })

        var estimatedRoute = results.routes[0].legs;

        console.log(estimatedRoute);

        var legs = results.routes[0].legs;
        var estimatedDistance = 0.0;
        var estimatedDuration = 0.0;

        for (var i = 0 ; i < legs.length; i++)
        {
            estimatedDistance = estimatedDistance + legs[i].distance.value;
            estimatedDuration = estimatedDuration + legs[i].duration.value;
        }

        var timeDuration = Math.floor(estimatedDuration / 3600) + " hrs " + Math.floor((estimatedDuration / 60) % 60) + " min";

        setDirection(results);
        setDistance(estimatedDistance);
        setDuration(estimatedDuration);
        console.log(estimatedDuration);
        console.log(estimatedDistance);
        console.log(timeDuration);
    }

    // Return waypoint inputs
    const getWaypoints = () => {
        return (
            <div>
            {inputList.map((x, i) => {
                return(
                    <div key={i} className="form-cell">
			            <Autocomplete onPlaceChanged={() => onPlaceChanged(i)} onLoad={(e) => onLoad(e, i)}>
                            <input
                                type="text"
                                placeholder="Search for Tide Information"
                                onChange={(e) => handleChange(i, e)}
                                value={wayPointList[i]['location'] || ''}
                            />
                        </Autocomplete>
                        {(inputList.length > 1 ? <button onClick={() => handleRemove(i)}>Remove</button> : <></>
)}
                    </div>
                )
            })}
            <button onClick={() => handleAdd()}>Add</button>

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
        console.log("submitTrip");
    }
    
    const getDatePanel = () => {
        return (
            <DatePanel/>
        )
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

    return(

        <div id="trip-page">
            
            <h2 className="underline">Post Your Trip!</h2>

            <h4 className="underline">Planned Route</h4>
            
            <div id="itinerary">
                <div id="travel-info">
                    <h5>Itinerary</h5>
                    <p>Choose your starting and ending positions, with any stops along the way.</p>
            
                    <div className="form-cell">
                        <label>Starting Point: </label>

                        <Autocomplete className="flex-input">
                            <input id="start-point" ref={originRef}/>
                        </Autocomplete>
                    </div>

                    <div className="form-cell">
                        <label>Destination: </label>
                        <Autocomplete className="flex-input">
                            <input id="end-point" ref={destinationRef}/>
                        </Autocomplete>
                    </div>

                    <div id="waypoint-container" className="form-cell">
                        <label>Additional Stops: </label>
                        {getWaypoints()}
                    </div>

                    <div>
                        {distance ? <p> Estimated Distance: {getDistanceInKm(distance)} </p> :  <></>}
                        {duration ? <p> Estimated Time: {getTimeInHrsMin(duration)} </p> : <></>}
                    </div>

                    <button onClick={calculateRoute}>
                        TestButton
                    </button>
                </div>

                <div id="google-map">
                    <GoogleMap 
                        zoom={15} 
                        mapContainerStyle={{width: '100%', height: '100%'}}
                        onLoad={(map) => setMap(map)}>
                        {direction ? <DirectionsRenderer directions={direction}/> : <></>}
                    </GoogleMap>
                </div>
            </div>

            <h4>Departure Time</h4>

                <div className="form-cell">
                    <label>Date: </label>
                    <Calendar 
                        value={dates}
                        onChange={setDates}
                        format="MMMM DD, YYYY"
                        minDate={new Date()}
                        sort
                    />

                    <label>Departure Time:</label>
                    <input type="time"></input>

                    <label>Return Time (Optional):</label>
                    <input type="time"></input>
                </div>

            <h4>Vehicle Details</h4>

            <div className="form-cell">
                <label>Model: </label>
                <input></input>
            </div>

            <div className="form-cell">
                <label>Type: </label>
                <input></input>
            </div>
            
            <div className="form-cell">

                <label>Color: </label>
                <input></input>
            </div>

            <h4>Preferences</h4>
            <div id="preference-section">

                <div className="preference-cell">
                    <h5>Luggage: </h5>
                    <div className="selector-container">
                        {getButtons("luggage-selector ", luggageBtn, setLuggageBtn, 
                            [
                                "None",
                                "Small",
                                "Medium",
                                "Large",
                            ])}
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
                                "Smoking"
                            ])}
                        </div>
                    </div>

                </div>

            </div>

            <h4>Trip Description</h4>
                <div className="form-cell">
                    <label>Description: </label>
                    <textarea id="desc" ></textarea>
                </div>

            <h4>Rules</h4>
            <p>These are some test rules</p>

            <button onClick={submitTrip}>
                Submit
            </button>
        </div>

    )

}

export default Trip