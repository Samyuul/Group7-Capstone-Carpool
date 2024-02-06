import "./trip.css"
import React, { useState } from 'react';

const Trip = (props) => {

    return(

        <div id="trip-page">
            
            <h2>Post Your Trip!</h2>

            <h4>Planned Route</h4>
            <div id="itinerary">
                <div id="travel-info">
                    <div class="form-cell">
                        <label>Starting Point: </label>
                        <input id="start-point"></input>
                    </div>

                    <div class="form-cell">
                        <label>Destination: </label>
                        <input id="end-point"></input>
                    </div>

                    <div class="form-cell">
                        <label>Additional Stops: </label>
                        <input id="stop-point"></input>
                    </div>
                </div>

                <div id="google-map">
                    GOOGLE MAP
                </div>
            </div>

            <h4>Departure Time</h4>

                <div class="form-cell">
                    <label>Time: </label>
                    <input type="datetime-local"></input>
                </div>

            <h4>Number of Seets</h4>

                <div class="form-cell">
                    1 2 3 4 5 6 7 8 
                </div>


            <h4>Preferences</h4>
            <div id="preference-section">

                <div class="preference-cell">
                    <label>Test: </label>
                    <input type="checkbox"></input>
                </div>

            </div>

            <h4>Trip Description</h4>
                <div class="form-cell">
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