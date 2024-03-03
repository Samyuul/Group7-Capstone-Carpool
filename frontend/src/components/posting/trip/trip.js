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
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //googleMapsApiKey: "",
        libraries
    })

    const [map, setMap] = useState(null);
    const [direction, setDirection] = useState(null);
    const [distance, setDitance] = useState('');
    const [duration, setDuration] = useState('');

    const originRef = useRef();
    const destinationRef = useRef();
    const waypointRef = useRef([]);

    const [inputList, setInputList] = useState(['']);
    const [wayPointList, setWayPointList] = useState(['']);

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
        var newSelectArr = [... otherPref];
        newSelectArr[index] = !newSelectArr[index];
        setOtherPref(newSelectArr); 
    }

	const onLoad = (autocomplete, index) => {
		var currArr = [... inputList]
		currArr[index] = autocomplete;
		setInputList(currArr);
	}

	const onPlaceChanged = (index) => {
		if (inputList[index] != null) {
			const place = inputList[index].getPlace();
			const name = place.name;
			const status = place.business_status;
			const formattedAddress = place.formatted_address;
			// console.log(place);
			console.log(`Name: ${name}`);
			console.log(`Formatted Address: ${formattedAddress}`);

            var currList = [... wayPointList]
            currList[index] = formattedAddress;
            setWayPointList(currList);

		} else {
			alert("Please enter text");
		}
	}


    // Change waypoint input 
    const handleInput = (e, index) => {
        const currList = [... wayPointList];
        //currList[index] = e.target.value;
        currList[index] = waypointRef.current[index].value;
        console.log(currList);
        setWayPointList(currList);
    }

    // Remove waypoint 
    const handleRemove = (index) => {
        var currList = [... wayPointList];
        var currInputList = [... inputList];
        currList.splice(1, 1);
        currInputList.splice(1, 1);
        setWayPointList(currList);
        setInputList(currInputList);
    }

    // Add waypoint 
    const handleAdd = () => {
        setInputList([... inputList, '']);
    }

    // Display and calculate route on map
    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            console.log(wayPointList);
            return
        } 

        const directionService = new google.maps.DirectionsService()
        const results = await directionService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING
        })

        setDirection(results);
    }

    // Return waypoint inputs
    const getWaypoints = () => {
        return (
            <div>
            {inputList.map((x, i) => {
                console.log(x, i);
                return(
                    <div key={i} className="form-cell">
			            <Autocomplete onPlaceChanged={() => onPlaceChanged(i)} onLoad={(e) => onLoad(e, i)}>
                            <input
                                type="text"
                                placeholder="Search for Tide Information"
                                defaultValue={wayPointList[i]}
                                style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                }}
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
                    className={"selector " + btnName + (val ? "current-selector" : "")} 
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

    // Don't page if maps hasn't been loaded successfully 
    if (!isLoaded) {
        console.log(process.env.REACT_APP_GOOGLE_API_KEY);
        return <></>
    }

    return(

        <div id="trip-page">
            
            <h2>Post Your Trip!</h2>

            <h4>Planned Route</h4>
            <div id="itinerary">
                <div id="travel-info">
                    <div className="form-cell">
                        <label>Starting Point: </label>

                        <Autocomplete>
                        <input id="start-point" ref={originRef}/>
                        </Autocomplete>
                    </div>

                    <div className="form-cell">
                        <label>Destination: </label>
                        <Autocomplete>
                        <input id="end-point" ref={destinationRef}/>
                        </Autocomplete>
                    </div>

                    <div id="waypoint-container" className="form-cell">
                        <label>Additional Stops: </label>
                        {getWaypoints()}
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