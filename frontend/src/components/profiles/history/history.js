import "./history.css";

import React, { useState, useEffect } from 'react';
import PostTemplate from "../../template/post/postTemplate";
import { useNavigate } from "react-router-dom";

import TripRoutes from "../../../routes/tripRoutes";
import ArchiveRoutes from "../../../routes/archiveRoutes";
import ReviewRoutes from "../../../routes/reviewRoutes";

import { Block } from "@vectopus/atlas-icons-react";
import AltReviewTemplate from "../../template/altReview/altReviewTemplate";

const History = () => {

    const navigate = useNavigate();

    const [pageData, setPageData] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState([]);

    const [reviewData, setReviewData] = useState([]);
    const [visibleReviews, setVisibleReviews] = useState([]);
    const [index, setIndex] = useState(0);

    const [pageView, setPageView] = useState([true, false, false, false, false]);

    // User clicks read more
    useEffect(() => {

        const numberOfItems = 3 + 2 * index;
        var validPosts = [];

        var count = 0;
        
        if(pageView[3]) // Load data for review rendering
        {
            
            for (let i = 0; i < reviewData.length; i++)
            {
                if (count < numberOfItems)
                {
                    validPosts.push(reviewData[i]);
                    count++;
                }
            }        

            setVisibleReviews(validPosts);
        }
        else // Load data for post rendering
        {
            for (let i = 0; i < pageData.length; i++)
            {
                if (count < numberOfItems)
                {
                    validPosts.push(pageData[i]);
                    count++;
                }
            }
    
            setVisiblePosts(validPosts);
        }

    }, [index, pageData, reviewData, pageView])

    useEffect(() => {

        var filter = {};

        if(pageView[0]) // Driver posts
        {
            filter = {
                userID: localStorage.getItem("userID"),
                postType: true
            }
    
            TripRoutes.getActiveTrip(filter)
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {})    
        }

        else if(pageView[1]) // Request posts
        {
            filter = {
                userID: localStorage.getItem("userID"),
                postType: false
            }
    
            TripRoutes.getActiveTrip(filter)
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {})   
        }

        else if(pageView[2]) // Riding as passenger posts
        {
            TripRoutes.getTripsAsPassenger({userID: localStorage.getItem("userID")})
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {})
        }

        else if(pageView[3]) // Reviews
        {
            ReviewRoutes.retrieveWrittenReviews({userID: localStorage.getItem("userID")})
            .then((response) => {
                setReviewData(response.data);
                setIndex(0);
            }).catch((e) => {})
        }

        else if(pageView[4]) // Archived trips 
        {
            ArchiveRoutes.getArchivedTrips({userID: localStorage.getItem("userID")})
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {})
        }

    }, [pageView])

    const archiveTrip = (tripID) => {

        ArchiveRoutes.archiveTrip({tripID: tripID})
        .then((response) => {
            window.location.reload();
        }).catch((e) => {})
    }

    const deletePost = (tripID) => {

        TripRoutes.deleteTrip({tripID: tripID})
        .then((response) => {
            window.location.reload();
        }).catch((e) => {})
    }

    const createReview = (tripID) => {
        navigate("/create-review", {
            state: {
                tripID: tripID
            }
        });
    }

    const leaveTrip = (tripID) => {

        TripRoutes.leaveTrip({tripID: tripID, userID: localStorage.getItem("userID")})
        .then((response) => {
            window.location.reload();
        }).catch((e) => {})
    }

    const renderPostings = () => {

        if(!visiblePosts.length) // No posts found
        {  
            return (
                <div id="history-content-container">
                    <div id="empty-history-page">
                        <Block size={44} weight="thin"/>
                        <p>Sorry, there are no trips found!</p>
                    </div> 
                </div>
            )
        }

        return (<div id="postings-history-container">
            { visiblePosts ? visiblePosts.map((val, i) => {
                return (
                    <div className="history-container" key={i}>
                        <PostTemplate clickable={true} data={val}/>
                        {
                            pageView[4] ? 
                            <div>
                                <button onClick={() => createReview(val.tripID)} className="trip-btn">Review</button>
                            </div> : 
                            
                            pageView[2] ? 
                            <div>
                                <button onClick={() => leaveTrip(val.tripID)} className="trip-btn">Leave</button>
                            </div> :
                            <div>
                                <button onClick={() => archiveTrip(val.tripID)} className="trip-btn">Resolve</button>
                                <button onClick={() => {val.postType ? navigate('/edit-trip/' + val.tripID) : navigate('/edit-request/' + val.tripID)}} className="trip-btn">Edit</button>
                                <button onClick={() => deletePost(val.tripID)} className="trip-btn">Delete</button>
                            </div>
                        }
                    </div>
                )
            }) : <></>}
            <button className="read-more-btn trip-btn history-btn" onClick={() => setIndex(index + 1)}>Load More</button>
            </div>
        )     
    }

    const editReview = (reviewID) => {

        ReviewRoutes.retrieveSingleReview({reviewID: reviewID})
        .then((response) => {
            navigate("/create-review", {
                state: {
                    reviewData: response.data
                }
            });
        }).catch((e) => {})

    }

    const deleteReview = (reviewID) => {

        ReviewRoutes.deleteReview({reviewID :reviewID})
        .then((response) => {
        }).catch((e) => {})

    }

    const renderReviews = () => {

        if(!visibleReviews.length) // No posts found
        {  
            return (
                <div id="history-content-container">
                    <div id="empty-history-page">
                        <Block size={44} weight="thin"/>
                        <p>Sorry, you have written no reviews!</p>
                    </div> 
                </div>
            )
        }

        return (<div id="review-history-container">
            { visibleReviews ? visibleReviews.map((val, i) => {
                return (
                    <div className="history-container" key={i}>
                        <AltReviewTemplate data={val}/>
                        {
                            <div>
                                <button onClick={() => editReview(val.reviewID)} className="trip-btn">Edit</button>
                                <button onClick={() => deleteReview(val.reviewID)} className="trip-btn">Delete</button>
                            </div> 
                        }
                    </div>
                )
            }) : <></>}
            <button className="read-more-btn trip-btn history-btn" onClick={() => setIndex(index + 1)}>Load More</button>
            </div>
        )     

    }

    return (
        <div id="history-page">
            <div id="history-nav-bar">
                <button className={pageView[0] ? "active-btn" : ""} onClick={() => setPageView([true, false, false, false, false])}>
                    Driver
                </button>
                <button className={pageView[1] ? "active-btn" : ""} onClick={() => setPageView([false, true, false, false, false])}>
                    Requests
                </button>
                <button className={pageView[2] ? "active-btn" : ""} onClick={() => setPageView([false, false, true, false, false])}>
                    Riding
                </button>
                <button className={pageView[3] ? "active-btn" : ""} onClick={() => setPageView([false, false, false, true, false])}>
                    Reviews
                </button>
                <button className={pageView[4] ? "active-btn" : ""} onClick={() => setPageView([false, false, false, false, true])}>
                    Archived
                </button>
            </div>
            <div className="underline"></div>
            {pageView[3] ? renderReviews() : renderPostings()}
        </div>
    )

}

export default History