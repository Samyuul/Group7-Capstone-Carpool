import "./profile.css"
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import {
    CarFront,
    User,
    RoadRouteArrowUp,
    VanTruck,
    RaiseHandsPeople,
    BlockProhibited
} from '@vectopus/atlas-icons-react';

import ProfileRoutes from "../../../routes/profileRoutes";
import StatisticsRoutes from "../../../routes/statisticsRoutes";
import ReviewRoutes from "../../../routes/reviewRoutes";

import AltReviewTemplate from "../../template/review/reviewTemplate";

const Profile = () => {

    const { username } = useParams();
    const [reviews, setReviews] = useState([]);
    const [reviewView, setReviewView] = useState("Driver");
    const [index, setIndex] = useState(1);

    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({});
    const [statisticData, setStatisticData] = useState({});
    const [reviewData, setReviewData] = useState([]);

    const [profileImage, setProfileImage] = useState("");

    // On initial load
    useEffect(() => {

        async function fetchData() {
            if (username) // Viewing other people's profiles
            {
                
                await ProfileRoutes.retrieveOthersProfile({username: username})
                .then(async (response) => {
    
                    if (response.data.userID === localStorage.getItem("userID")) // Redirect to your own profile
                    {
                        navigate("/profile");
                        window.location.reload();
                    }    
    
                    await StatisticsRoutes.retrieveStatistics({userID: response.data.userID})
                    .then((response) => {
                        setStatisticData(response.data);
                    }).catch((e) => {})

                    await ReviewRoutes.retrieveAllReviews({userID: response.data.userID})
                    .then(async (response) => {
                        setReviewData(response.data);
                    }).catch((e) => {});

                    setProfileData(response.data);
                    setProfileImage(response.data.profileImage);
    
                }).catch((e) => { // Not found, redirect to our profile
                    navigate("/profile");
                    window.location.reload();
                })          

            }
            else // Loading your own profile
            {
                
                // Load profile data
                await ProfileRoutes.retrieveProfile({userID: localStorage.getItem("userID")})
                .then(async (response) => {
                    setProfileData(response.data);
                    setProfileImage(response.data.profileImage);
                }).catch((e) => {});

                // Load statistic data
                await StatisticsRoutes.retrieveStatistics({userID: localStorage.getItem("userID")})
                .then(async (response) => {
                    setStatisticData(response.data);
                }).catch((e) => {});

                // Load review data
                await ReviewRoutes.retrieveAllReviews({userID: localStorage.getItem("userID")})
                .then(async (response) => {
                    setReviewData(response.data);
                }).catch((e) => {});
            }
        }

        fetchData();
        
    }, [navigate, username])

    // User clicks read more
    useEffect(() => {

        if (reviewData.length) // Data exists
        {
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
        }


    }, [index, reviewView, reviewData])

    const renderReviews = () => {
        return(
            reviews.map((val, i) => {
                return(
                    <AltReviewTemplate key={i} data={val} />
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
        setReviewView("Driver");
    }

    const setPassengerReview = () => {
        setIndex(1);
        setReviewView("Passenger");
    }

    const getDistanceInKm = (meter) => {
        return (meter / 1000.0).toFixed(2) + " km"
    }

    return (

        <div id="profile-page">
            
            <div id="profile-header">
                <div id="profile-image">
                    <img src={profileImage ? profileImage : require("../../../img/Default_pfp.jpg")} alt="profile"></img>
                    <div id="user-info">
                        {username ? <></> :
                            <div className="trip-btn" onClick={() => navigate('/edit-profile')}>Edit</div>}
                        <div id="header-info">
                            <div className="header-info-section">
                                <CarFront size={40} weight="bold" />
                                <h2>{statisticData.tripDriver}</h2>
                                <h4>Trips As Driver</h4>
                            </div>
                            <div className="header-info-section">
                                <User size={40} weight="bold" />
                                <h2>{statisticData.tripPassenger}</h2>
                                <h4>Trips as Passenger</h4>
                            </div>
                            <div className="header-info-section">
                                <RoadRouteArrowUp size={40} weight="bold" />
                                <h2>{getDistanceInKm(statisticData.tripDistance)}</h2>
                                <h4>Travelled as Both</h4>
                            </div>
                        </div>
                        <div id="user-identity">
                            <h1>{profileData.firstName} {profileData.lastName}</h1>
                            <h4>Joined: {statisticData.joined}</h4>
                            <h4>{profileData.gender ? profileData.gender : "N.A"}, Age {profileData.age > 0? profileData.age : "N.A"}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div id="profile-desc">
                <h2 className="underline">About Me</h2>
                <p>{profileData.desc}</p>
            </div>

            <h2 className="underline">{profileData.firstName ? profileData.firstName : "N.A"}'s Reviews</h2>
            <div id="both-profile-rating">
                <div id="profile-rating">
                    <div className="individual-profile-rating">
                        <VanTruck size={40}/>
                        <h2>{statisticData.driverRating < 0 ? "N.A" : statisticData.driverRating} / 5.0</h2>
                        <h4>As a Driver</h4>
                    </div>
                    <div className="individual-profile-rating">
                        <RaiseHandsPeople size={40}/>
                        <h2>{statisticData.passengerRating < 0 ? "N.A" : statisticData.passengerRating} / 5.0</h2>
                        <h4>As a Passenger</h4>
                    </div>
                </div>
            </div>
            <div id="review-selector">
                <Link className={reviewView !== "Driver" ? "inactive-selector" : ""} id="driver-review-selector" onClick={() => setDriverReview()}><h2>Driver</h2></Link>
                <Link className={reviewView !== "Driver" ? "" : "inactive-selector"} id="passenger-review-selector" onClick={() => setPassengerReview()}><h2>Passenger</h2></Link>
            </div>
            <div className="review-section" id={reviewView !== "Driver" ? "review-section-driver" : "review-section-passenger" }>
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

