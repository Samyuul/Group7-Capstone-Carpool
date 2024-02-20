import "./request.css"
import React, { useState } from 'react';

const Request = (props) => {

    return (
        <div id="request-page">

            <h2>Post Your Request!</h2>

            <h4>Planned Route</h4>
            <div id="itinerary">
                <div id="travel-info">
                    <div className="form-cell">
                        <label>Starting Point: </label>
                        <input id="start-point"></input>
                    </div>

                    <div className="form-cell">
                        <label>Destination: </label>
                        <input id="end-point"></input>
                    </div>
                </div>

                <div id="google-map">
                    GOOGLE MAP
                </div>
            </div>

            <h4>Departure Time</h4>

                <div className="form-cell">
                    <label>Time: </label>
                    <input type="datetime-local"></input>
                </div>


            <h4>Preferences</h4>
            <div id="preference-section">

                <div className="preference-cell">
                    <label>Test: </label>
                    <input type="checkbox"></input>
                </div>

            </div>

            <h4>Rules</h4>
            <p>These are some test rules</p>

            <button>
                Submit
            </button>
        </div>
    )

}

export default Request