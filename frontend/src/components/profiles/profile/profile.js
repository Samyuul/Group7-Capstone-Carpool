import "./profile.css"
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import reviewData from "./data.json";

import {
    CarFront,
    User,
    RoadRouteArrowUp,
    VanTruck,
    RaiseHandsPeople,
    Star,
    BlockProhibited
} from '@vectopus/atlas-icons-react';

const Profile = (props) => {

    const { username } = useParams();
    const [reviews, setReviews] = useState([]);
    const [reviewView, setReviewView] = useState(false);
    const [index, setIndex] = useState(1);

    const navigate = useNavigate();

    const getProfileImage = () => {
        return require('../../../img/head.webp');
    }

    const profileData = {
        firstName: "Sarah",
        lastName: "Smith",
        joined: "Sept 18, 2023",
        age: 23,
        tripDriver: 7,
        tripPassenger: 3,
        tripDistance: 54.2,
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed placerat lectus, at porta risus. Cras scelerisque lobortis imperdiet. Cras rutrum tortor nec enim dictum, at lacinia sapien pharetra. Nunc congue sagittis nunc sit amet iaculis. Morbi pellentesque eget nisl sit amet condimentum. Aliquam sit amet tempor tellus. In interdum mauris vitae molestie tempor. Vestibulum quis purus quam.",
        passengerRating: 4.3,
        driverRating: 4.5,
        gender: "Female",
        day: 12,
        month: 4,
        year: 1996
    }

    useEffect(() => {

        const retrieved_reviews = reviewData;
        const numberOfItems = 2 * index;
        var validReviews = [];

        var count = 0;
        
        for (let i = 0; i < retrieved_reviews.length; i++)
        {
            // false == driver review, true = passenger review
            if (retrieved_reviews[i].type === reviewView) // Match desired review type
            {
                if (count < numberOfItems)
                {
                    validReviews.push(retrieved_reviews[i]);
                    count++;
                }
            }
        }

        setReviews(validReviews);

    }, [index, reviewView])

    const renderReviews = () => {

        return(
            reviews.map((val, i) => {
                return(
                    <div key={i}>
                        <div className="review">
                            <h4>{val.name} - <em>{val.type ? "Passenger" : "Driver"} Review</em></h4>
                            <h4 className="review-icon">{val.subject} - {val.rating} / 5<Star size={24}/> </h4>
                            <h4>From: {val.start} to {val.end} on {val.date}</h4>
                            <p>{val.desc}</p>
                        </div>
                        <hr></hr>
                    </div>
                )
            })
        )
    }

    const emptyReviewMessage = () => {

        return(
            <div className="empty-msg">
                <BlockProhibited size={32} />
                <p>Sorry, no reviews available</p>
            </div>
        )

    }

    const setDriverReview = () => {
        setIndex(1);
        setReviewView(false);
    }

    const setPassengerReview = () => {
        setIndex(1);
        setReviewView(true);
    }

    return (

        <div id="profile-page">
            
            <div id="profile-header">
                <div id="profile-image">
                    <img src={getProfileImage()} alt="profile"></img>
                    <div id="user-info">
                        <div className="trip-btn" onClick={() => navigate('/edit-profile')}>Edit</div>
                        <div id="header-info">
                            <div className="header-info-section">
                                <CarFront size={40} weight="bold" />
                                <h2>{profileData.tripDriver}</h2>
                                <h4>Trips As Driver</h4>
                            </div>
                            <div className="header-info-section">
                                <User size={40} weight="bold" />
                                <h2>{profileData.tripPassenger}</h2>
                                <h4>Trips as Passenger</h4>
                            </div>
                            <div className="header-info-section">
                                <RoadRouteArrowUp size={40} weight="bold" />
                                <h2>{profileData.tripDistance} km</h2>
                                <h4>Travelled as Both</h4>
                            </div>
                        </div>
                        <div id="user-identity">
                            <h1>{profileData.firstName} {profileData.lastName}</h1>
                            <h4>Joined: {profileData.joined}</h4>
                            <h4>{profileData.gender}, Age {profileData.age}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div id="profile-desc">
                <h2 className="underline">About Me</h2>
                <p>{profileData.desc}</p>
            </div>

            <h2 className="underline">{profileData.firstName}'s Reviews</h2>
            <div id="both-profile-rating">
                <div id="profile-rating">
                    <div className="individual-profile-rating">
                        <VanTruck size={40}/>
                        <h2>{profileData.driverRating} / 5.0</h2>
                        <h4>As a Driver</h4>
                    </div>
                    <div className="individual-profile-rating">
                        <RaiseHandsPeople size={40}/>
                        <h2>{profileData.passengerRating} / 5.0</h2>
                        <h4>As a Passenger</h4>
                    </div>
                </div>
            </div>
            <div id="review-selector">
                <Link className={reviewView ? "inactive-selector" : ""} id="driver-review-selector" onClick={() => setDriverReview()}><h2>Driver</h2></Link>
                <Link className={reviewView ? "" : "inactive-selector"} id="passenger-review-selector" onClick={() => setPassengerReview()}><h2>Passenger</h2></Link>
            </div>
            <div className="review-section" id={reviewView ? "review-section-driver" : "review-section-passenger" }>
                {reviews.length ? 
                <>
                    {renderReviews()}
                    <Link className="read-more-btn trip-btn" onClick={() => setIndex(index + 1)}>Read More</Link>
                </>
                : emptyReviewMessage()}
            </div>
        </div>
    
    )

}

export default Profile

