import "./trip.css"
import React, { useState, useRef } from "react";

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

    const [wayPointList, setWayPointList] = useState(['', '']);

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
        console.log(index);
        console.log(currList);
        currList.splice(index, 1);
        console.log(currList);
        setWayPointList(currList);
    }

    // Add waypoint 
    const handleAdd = () => {
        setWayPointList([... wayPointList, '']);
    }

    // Display and calculate route on map
    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            console.log(waypointRef);
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

	const onLoad = (autocomplete, index) => {
		console.log(autocomplete, index);
		var currArr = [... wayPointList]
		console.log(currArr);
		currArr[index] = autocomplete;
		console.log(currArr);
		setWayPointList(currArr);
	}

	const onPlaceChanged = (index) => {
		console.log(wayPointList);
		if (wayPointList[index] != null) {
			console.log(wayPointList[index]);
			const place = wayPointList[index].getPlace();
			const name = place.name;
			const status = place.business_status;
			const formattedAddress = place.formatted_address;
			// console.log(place);
			console.log(`Name: ${name}`);
			console.log(`Business Status: ${status}`);
			console.log(`Formatted Address: ${formattedAddress}`);
		} else {
			alert("Please enter text");
		}
	}

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<div className="App">
		<div id="searchColumn">
			<h2>Tide Forecast Options</h2>
			{wayPointList.map((x, i) => {
                return(
                    <div key={i} className="form-cell">
			
			<Autocomplete onPlaceChanged={() => onPlaceChanged(i)} onLoad={(e) => onLoad(e, i)}>
				<input
					type="text"
					placeholder="Search for Tide Information"
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
			</div>
                )
            })}
		</div>
		</div>
	);
}

export default Trip;
