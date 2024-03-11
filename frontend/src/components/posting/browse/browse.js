import "./browse.css"
import React, { useState, useEffect, useRef } from 'react';

import DatePicker from "react-multi-date-picker";

import { 
    useJsApiLoader, 
    Autocomplete
} from '@react-google-maps/api';

import { CalendarDots } from "@vectopus/atlas-icons-react";

import waypoint from "../../../img/waypoint.svg";
import data from "./test.json";
import PostTemplate from "../../template/postTemplate";

import ReactPaginate from 'react-paginate';

const libraries = ['places'];
const items = [...Array(33).keys()];
const postData = data.concat(data).concat(data).concat(data);

const Browse = (props) => {

    // Pagination variables
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const [startLoc, setStartLoc] = useState("");
    const [endLoc, setEndLoc] = useState("");
    const [dates, setDates] = useState([]);
    const originRef = useRef();
    const destinationRef = useRef();

    const itemsPerPage = 4;

    // Set up pagination 
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(postData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(postData.length / itemsPerPage));
        window.scrollTo({
        //    top: 0,
        //    left: 0,
            behavior: "smooth"
          });
    }, [itemOffset, itemsPerPage]);
    
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % items.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //googleMapsApiKey: "",
        libraries
    })

    const renderPostings = (data) => {

        return (
            <div className="items">
                {data && data.map((val, i) => {
                    return(<PostTemplate key={i} data={val}/>)
                })}
            </div>
        )
    }
    
    const searchFunc = () => {
        
        var searchConditions = {
            startLoc: startLoc,
            endLoc: endLoc,
            dates: dates
        }

        console.log(searchConditions);
    }

    // Don't page if maps hasn't been loaded successfully 
    if (!isLoaded) {
        return <></>
    }

    return (
        <div id="browse-page">
            <h2>
                Find a Trip
            </h2>
            <p>
                Enter Your Starting and Ending Point and Browse Away!
            </p>

            <div className="search-bar">
                <div className="flex-inline">
                    <img className="waypoint-svg" alt="waypoint" src={waypoint}/>
                    <Autocomplete onPlaceChanged={(e) => setStartLoc(originRef.current.value)}>
                        <input placeholder="Start" ref={originRef}/>
                    </Autocomplete>
                </div>

                <div className="flex-inline">
                    <img className="waypoint-svg" alt="waypoint" src={waypoint}/>
                    <Autocomplete onPlaceChanged={(e) => setEndLoc(destinationRef.current.value)}>
                        <input placeholder="End" ref={destinationRef}/>
                    </Autocomplete>
                </div>

                <div className="flex-inline">
                    <CalendarDots className="calendar-svg" size={24}/>
                    <DatePicker
                        id="date-picker-request"
                        value={dates}
                        onChange={setDates}
                        format="MMMM DD, YYYY"
                        minDate={new Date()}
                        sort
                        editable={false}
                    />
                </div>

                
                <button className="gradient-btn trip-btn" onClick={() => searchFunc()}>
                    Search
                </button>

            </div>

            {renderPostings(currentItems)}
            <ReactPaginate
                nextLabel="&#8658;"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="&#8656;"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
    
        </div>
    )

}

export default Browse