import "./profile.css"
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
    CarFront,
    User,
    RoadRouteArrowUp,
    VanTruck,
    RaiseHandsPeople
} from '@vectopus/atlas-icons-react';

const Profile = (props) => {

    const { username } = useParams();
    const [reviews, setReviews] = useState([]);
    const [reviewView, setReviewView] = useState(false);
    const [index, setIndex] = useState(1);

    const getProfileImage = () => {
        return require('../../../img/head.webp');
    }

    useEffect(() => {

//        const retrieved_reviews = [];
        const retrieved_reviews = ["Test Name", "Asdf", "Zxcv", "Fghj", "Rtyu"];

        const numberOfItems = 2 * index;
        var newArray = [];
        
        for (let i = 0; i < retrieved_reviews.length; i++)
        {
            if (i < numberOfItems)
                newArray.push(retrieved_reviews[i]);
        }

        setReviews(newArray);

    }, [index])

    const renderReviews = () => {

        var reviews_ = ['Profile Name'];

        return(
            reviews.map((val, i) => {
                return(
                    <div key={i}>
                        <div className="review">
                            <h4>{val} - <em>Driver Review</em></h4>
                            <h4>This is a subject line 4.5 / 5</h4>
                            <h4>From Windsor to Toronto on Sept 24 2023</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed placerat lectus, at porta risus. Cras 
                                scelerisque lobortis imperdiet. Cras rutrum tortor nec enim dictum, at lacinia sapien pharetra. Nunc congue 
                                sagittis nunc sit amet iaculis.                     
                            </p>
                        </div>
                        <hr></hr>
                    </div>
                )
            })
        )
    }

    const emptyReviewMessage = () => {

        return(
            <div>
                Sorry, no reviews available
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
                    <img src={getProfileImage()}></img>
                    <div id="user-info">
                        <div id="header-info">
                            <div className="header-info-section">
                                <CarFront size={40} weight="bold" />
                                <h2>7</h2>
                                <h4>Trips As Driver</h4>
                            </div>
                            <div className="header-info-section">
                                <User size={40} weight="bold" />
                                <h2>3</h2>
                                <h4>Trips as Passenger</h4>
                            </div>
                            <div className="header-info-section">
                                <RoadRouteArrowUp size={40} weight="bold" />
                                <h2>54.2 km</h2>
                                <h4>Travelled as Both</h4>
                            </div>
                        </div>
                        <div id="user-identity">
                            <h1>Sarah Smith</h1>
                            <h4>Joined: Sept 18 2023</h4>
                            <h4>Female, Age 23</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div id="profile-desc">
                <h2 className="underline">About Me</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed placerat lectus, at porta risus. Cras 
                    scelerisque lobortis imperdiet. Cras rutrum tortor nec enim dictum, at lacinia sapien pharetra. Nunc congue 
                    sagittis nunc sit amet iaculis. Morbi pellentesque eget nisl sit amet condimentum. Aliquam sit amet tempor tellus.
                    In interdum mauris vitae molestie tempor. Vestibulum quis purus quam.
                </p>
            </div>

            <h2 className="underline">Sarah's Reviews</h2>
            <div id="both-profile-rating">
                <div id="profile-rating">
                    <div className="individual-profile-rating">
                        <VanTruck size={40}/>
                        <h2>4.5 / 5.0</h2>
                        <h4>As a Driver</h4>
                    </div>
                    <div className="individual-profile-rating">
                        <RaiseHandsPeople size={40}/>
                        <h2>4.3 / 5.0</h2>
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

