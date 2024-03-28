import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './review.css'

import {
    CalendarSchedule,
    Notebook,
    VanTruck,
    ThumbsUpLikeStar,
    PinDestination,
    Comment,
    ArrowDownCircle,
    Account
} from '@vectopus/atlas-icons-react'

import ReviewRoutes from '../../../routes/reviewRoutes';
import ArchiveRoutes from '../../../routes/archiveRoutes';

const Review = () => {

    const [subject, setSubject] = useState("");
    const [rating, setRating] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("");
    const [desc, setDesc] = useState("");
    const [subjectUsername, setSubjectUsername] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [subjectID, setSubjectID] = useState("");
    const [isDriver, setIsDriver] = useState("");

    const [passengerNames, setPassengerNames] = useState([]);
    const [passengerUsernames, setPassengerUsernames] = useState([]);
    const [passengerIDs, setPassengerIDs] = useState([]); 
    const [subjectSelector, setSubjectSelector] = useState("");

    const { state } = useLocation();

    const navigate = useNavigate();

    const getRatingDropdown = () => {

        return (<>
            <option value={""}>---</option>
            {Array.from(Array(51), (_, i) => i / 10.0).reverse().map((val, i) => {

                return (
                    <option key={i} value={val}>{val}</option>
                )

            })}
        </>)
    }


    const submitReview = () => {

        var review = {};

        if(!subject.length || !rating.length)
        {
            console.log("error!!!!");
            return
        }

        if(!isDriver) // Leave a passenger review
        {
            console.log(passengerIDs);

            review = {
                subject: subject,
                rating: rating,
                start: start,
                end: end,
                date: date,
                type: type,
                desc: desc,
                username: localStorage.getItem("username"),
                userID: localStorage.getItem("userID"),
                subjectUsername: passengerUsernames[subjectSelector],
                subjectID: passengerIDs[subjectSelector],
                subjectName: passengerNames[subjectSelector]
            }    
        }
        else // Leave a driver review
        {
            review = {
                subject: subject,
                rating: rating,
                start: start,
                end: end,
                date: date,
                type: type,
                desc: desc,
                username: localStorage.getItem("username"),
                userID: localStorage.getItem("userID"),
                subjectUsername: subjectUsername,
                subjectID: subjectID,
                subjectName: subjectName
            }    
        }

        console.log(review);

        ReviewRoutes.createReview(review)
        .then((response) => {
            navigate("/history");
            window.location.reload();
        }).catch((e) => {
            console.log(e.message);
        })

    }

    const editReview = () => {

        if(!subject.length || !rating.length)
        {
            console.log("error!!!!");
            return
        }

        var review = {
            desc: desc,
            rating: rating,
            subject: subject,
            reviewID: state.reviewData.reviewID
        }

        ReviewRoutes.editReview(review)
        .then((response) => {
            navigate("/history");
            window.location.reload();
        }).catch((e) => {
            console.log(e.message);
        })

    }

    const returnUsernameDropdown = () => {

        return (
            <>
                <option value={""}>- Username -</option>
                {passengerUsernames.map((val, i) => {
                    return(<option key={i} value={i}>{val}</option>)
                })}
            </>
        )
    }

    const returnNameDropdown = () => {

        return (
            <>
                <option value={""}>- Name -</option>
                {passengerNames.map((val, i) => {
                    return(<option key={i} value={i}>{val}</option>)
                })}
            </>
        )
    }
    
    useEffect(() => {

        if(state.tripID) // Populate via tripID, new review
        {
            ArchiveRoutes.getSingleArchivedTrip(state)
            .then((response) => {
    
                var tripData = response.data;
    
                if(response.data.userID === localStorage.getItem("userID")) // Leave a passenger review
                {
                    setType("Passenger")
                    setIsDriver(false);
                    setPassengerIDs(response.data.passengerID);
                    setPassengerNames(response.data.passengerName);
                    setPassengerUsernames(response.data.passengerUsername);
                }
                else // Leave a driver review
                {
                    setType("Driver")
                    setIsDriver(true);
                    setSubjectUsername(tripData.username);
                    setSubjectName(tripData.name);
                    setSubjectID(tripData.userID);
                }
        
                setStart(tripData.start);
                setEnd(tripData.end);
                setDate(tripData.date);
    
    
            }).catch((e) => {
                console.log(e.message);
            })
        }
        else if(state.reviewData)
        {
            var tripData = state.reviewData;

            setStart(tripData.start);
            setEnd(tripData.end);
            setDate(tripData.date);
            setSubjectUsername(tripData.subjectUsername);
            setSubjectName(tripData.subjectName);
            setSubjectID(tripData.subjectID);
            setIsDriver(true);
            setRating(tripData.rating);
            setType(tripData.type);
            setDesc(tripData.desc);
            setSubject(tripData.subject);

        }

    }, [state])

    return (
        <div id="edit-review">
            <div id="review-inputs">

                <label htmlFor='subject-review-input'>Username - Full Name: </label>

                <div className="profile-input-txt">
                    <Account size={24} />
                    {isDriver ? <>
                        <input readOnly placeholder='Username' value={subjectUsername}/>
                        <ArrowDownCircle size={24} className="dropdown-svg hidden-svg"/>
                    </> 
                    : <><select
                        value={subjectSelector}
                        onChange={(e) => setSubjectSelector(e.target.value)}
                        className='select-dropdown'>
                        
                        {passengerUsernames ? returnUsernameDropdown() : <></>}
                    </select>
                    <ArrowDownCircle size={24} className="dropdown-svg"/></>}
                                        
                    <Account size={24} />
                    {isDriver ? <>
                        <input readOnly placeholder='Full Name' value={subjectName}/>
                        <ArrowDownCircle size={24} className="dropdown-svg hidden-svg"/>
                    </>
                    : <><select
                        value={subjectSelector}
                        onChange={(e) => setSubjectSelector(e.target.value)}
                        className='select-dropdown'>
                        
                        {passengerUsernames ? returnNameDropdown() : <></>}
                    </select>
                    <ArrowDownCircle size={24} className="dropdown-svg"/></>}
                </div>

                <label htmlFor='rating-review-input'>Rating: </label>
                <div className="profile-input-txt">
                <Comment size={24} />
                    <input id='subject-review-input' placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)}/>
                    <ArrowDownCircle size={24} className="dropdown-svg hidden-svg"/>
                    
                    
                    <ThumbsUpLikeStar size={24} />                
                    <select
                        id='rating-review-input'
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className='select-dropdown'>
                        {getRatingDropdown()}
                    </select>
                    <ArrowDownCircle size={24} className="dropdown-svg"/>
                </div>

                <label>Location: </label>
                <div className="profile-input-txt">
                    <PinDestination size={24}/>
                    <input readOnly value={start} onChange={(e) => setStart(e.target.value)} id=""/>
                    <p>to</p>
                    
                    <PinDestination size={24}/>
                    <input readOnly value={end} onChange={(e) => setEnd(e.target.value)} id=""/>
                </div>

                <label>Date:</label>
                <div className="profile-input-txt">
                    <CalendarSchedule size={24}/>
                    <input readOnly value={date} onChange={(e) => setDate(e.target.value)} id=""/>                
                </div>

                <label htmlFor='review-type-input'>Type: </label>
                <div className="profile-input-txt dropdown-input">
                    <VanTruck size={24}/>
                    <input readOnly value={type} onChange={(e) => setType(e.target.value)} id=""/>                
                </div>

                <label htmlFor='review-desc-input'>Review:</label>
                <div className="profile-input-txt">
                    <Notebook size={24}/>
                    <div className="textarea-container">
                        <textarea placeholder='Optional ...' value={desc} onChange={(e) => setDesc(e.target.value)} id="review-desc-input" className="textarea-style"/>
                    </div>
                </div>

                {state.reviewData ?
                <button onClick={() => editReview()} className="trip-btn">Update</button> :
                <button onClick={() => submitReview()} className="trip-btn">Submit</button>}
            </div>
        </div>
    )

}

export default Review;