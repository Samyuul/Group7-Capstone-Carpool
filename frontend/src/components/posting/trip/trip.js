import "./trip.css"
import React, { useState, useRef } from 'react';

import { 
    useJsApiLoader, 
    GoogleMap, 
    Marker, 
    Autocomplete,
    DirectionsRenderer
} from '@react-google-maps/api';

const google = window.google = window.google ? window.google : {}

const Trip = (props) => {

    const { isLoaded  } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: ['places']
    })

    const center = {lat: 43.6532, lng: 79.3832};

    const [map, setMap] = useState(null);
    const [direction, setDirection] = useState(null);
    const [distance, setDitance] = useState('');
    const [duration, setDuration] = useState('');
    
    const originRef = useRef();
    const destinationRef = useRef();

    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
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

                    <div className="form-cell">
                        <label>Additional Stops: </label>
                        <input id="stop-point"></input>
                    </div>

                    <button onClick={calculateRoute}>
                        TestButton
                    </button>
                </div>

                <div id="google-map">
                    <GoogleMap 
                        center={center} 
                        zoom={15} 
                        mapContainerStyle={{width: '100%', height: '100%'}}
                        onLoad={(map) => setMap(map)}>
                        <Marker position={center} />
                        {direction ? <DirectionsRenderer directions={direction}/> : <></>}
                    </GoogleMap>
                </div>
            </div>

            <h4>Departure Time</h4>

                <div className="form-cell">
                    <label>Time: </label>
                    <input type="datetime-local"></input>
                </div>

            <h4>Number of Seats</h4>

                <div className="form-cell">
                    1 2 3 4 5 6 7 8 
                </div>


            <h4>Preferences</h4>
            <div id="preference-section">

                <div className="preference-cell">
                    <label>Test: </label>
                    <input type="checkbox"></input>
                </div>

            </div>

            <h4>Trip Description</h4>
                <div className="form-cell">
                    <label>Description: </label>
                    <textarea id="desc" ></textarea>
                </div>

            <h4>Rules</h4>
            <p>These are some test rules</p>

            <button>
                Submit
            </button>
        </div>

    )

}

export default Trip