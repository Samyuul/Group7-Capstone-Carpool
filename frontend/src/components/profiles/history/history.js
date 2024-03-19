import "./history.css";

import React, { useState, useRef, useEffect } from 'react';
import PostTemplate from "../../template/post/postTemplate";
import { useNavigate } from "react-router-dom";

import TripRoutes from "../../../routes/tripRoutes";
import ArchiveRoutes from "../../../routes/archiveRoutes";
import ReviewRoutes from "../../../routes/reviewRoutes";

import { Block } from "@vectopus/atlas-icons-react";
import ReviewTemplate from "../../template/review/reviewTemplate";
import AltReviewTemplate from "../../template/altReview/altReviewTemplate";

const History = (props) => {

    const navigate = useNavigate();

    const [postType, setPostType] = useState(true);
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

    }, [index, pageData, reviewData])

    useEffect(() => {

        if(pageView[0]) // Driver posts
        {
            var filter = {
                userID: localStorage.getItem("userID"),
                postType: true
            }
    
            TripRoutes.getActiveTrip(filter)
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {
                console.log(e.message)
            })    
        }

        else if(pageView[1]) // Request posts
        {
            var filter = {
                userID: localStorage.getItem("userID"),
                postType: false
            }
    
            TripRoutes.getActiveTrip(filter)
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {
                console.log(e.message)
            })   
        }

        else if(pageView[2]) // Riding as passenger posts
        {
            TripRoutes.getTripsAsPassenger({userID: localStorage.getItem("userID")})
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {
                console.log(e.message);
            })
        }

        else if(pageView[3]) // Reviews
        {
            ReviewRoutes.retrieveWrittenReviews({userID: localStorage.getItem("userID")})
            .then((response) => {
                setReviewData(response.data);
                setIndex(0);
            }).catch((e) => {
                console.log(e.message);;
            })
        }

        else if(pageView[4]) // Archived trips 
        {
            ArchiveRoutes.getArchivedTrips({userID: localStorage.getItem("userID")})
            .then((response) => {
                setPageData(response.data);
                setIndex(0);
            }).catch((e) => {
                console.log(e.message);;
            })
        }

    }, [pageView])

    const archiveTrip = (tripID) => {

        ArchiveRoutes.archiveTrip({tripID: tripID})
        .then((response) => {
            window.location.reload();
        }).catch((e) => {
            console.log(e.message);
        })
    }

    const deletePost = (tripID) => {

        TripRoutes.deleteTrip({tripID: tripID})
        .then((response) => {
            console.log(response.data);
            window.location.reload();
        }).catch((e) => {
            console.log(e.message);
        })

    }

    const createReview = (tripID) => {
        console.log("pog");
        navigate("/create-review", {
            state: {
                tripID: tripID
            }
        });
    }

    const leaveTrip = (tripID) => {

        TripRoutes.leaveTrip({tripID: tripID, userID: localStorage.getItem("userID")})
        .then((response) => {
            console.log(response.data);
            window.location.reload();
        }).catch((e) => {
            console.log(e.message);
        })
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
                        <PostTemplate clickable={false} data={val}/>
                        {
                            pageView[4] ? 
                            <div>
                                <button onClick={() => createReview(val.tripID)} className="trip-btn">Review</button>
                            </div> : 
                            
                            pageView[3] ? 
                            <div>
                                <button>YEP</button>
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
        console.log(reviewID);

        ReviewRoutes.retrieveSingleReview({reviewID: reviewID})
        .then((response) => {
            console.log(response.data);
            navigate("/create-review", {
                state: {
                    reviewData: response.data
                }
            });
        }).catch((e) => {
            console.log(e.message);
        })

    }

    const deleteReview = (reviewID) => {
        console.log(reviewID);

        ReviewRoutes.deleteReview({reviewID :reviewID})
        .then((response) => {
            console.log(response);
        }).catch((e) => {
            console.log(e.message);
        })

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