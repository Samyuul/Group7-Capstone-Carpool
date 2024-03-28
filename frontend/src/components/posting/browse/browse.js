import "./browse.css"
import React, { useState, useEffect, useRef } from 'react';

import DatePicker from "react-multi-date-picker";

import { 
    useJsApiLoader, 
    Autocomplete
} from '@react-google-maps/api';

import { 
    CalendarDots,
    Block,
    PinDestination
 } from "@vectopus/atlas-icons-react";

import PostTemplate from "../../template/post/postTemplate";

import ReactPaginate from 'react-paginate';

import TripRoutes from "../../../routes/tripRoutes";

const libraries = ['places'];

const Browse = () => {

    // Pagination variables
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const [startLoc, setStartLoc] = useState("");
    const [endLoc, setEndLoc] = useState("");
    const [dates, setDates] = useState([]);

    const [pageData, setPageData] = useState([]);

    const [fullFlag, setFullFlag] = useState(false);
    const [requestFlag, setRequestFlag] = useState(false);

    const originRef = useRef();
    const destinationRef = useRef();

    const [pageNumber, setPageNumber] = useState(0);

    const itemsPerPage = 4;

    // Fetch initial postings
    useEffect(() => {

        TripRoutes.getBrowseTrip({})
        .then((response) => {
            var currData = response.data;
            const endOffset = 0 + itemsPerPage;
            setCurrentItems(currData.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(currData.length / itemsPerPage));
            setPageData(currData);

        }).catch((e) => {
            console.log(e.message);
        }) 

    }, []);

    // Set up pagination 
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(pageData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(pageData.length / itemsPerPage));

    }, [itemOffset, itemsPerPage, pageData]);
    
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % pageData.length;
        setItemOffset(newOffset);
        setPageNumber(event.selected);
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //googleMapsApiKey: "",
        libraries
    })

    const renderPostings = (data) => {

        return (
            <div className="items">
                {data ? data.map((val, i) => {
                    return(<PostTemplate key={i} clickable={true} data={val}/>)
                }) : <></>}
            </div>
        )
    }
    
    const searchFunc = () => {

        var datesAsString = dates.map((date, i) => {
            return date.month.name + " " + date.day + ", " + date.year
        });

        var searchConditions = {
            startLoc: startLoc,
            endLoc: endLoc,
            dates: datesAsString,
            requestFlag: requestFlag,
            fullFlag: fullFlag
        }

        TripRoutes.getSearchResults(searchConditions)
        .then((response) => {
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(response.data.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(response.data.length / itemsPerPage));
            setPageData(response.data);
            setItemOffset(0);
            setPageNumber(0);
        }).catch((e) => {
            console.log(e.message);
        })

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
                    <PinDestination className="waypoint-svg" size={24}/>
                    <Autocomplete onPlaceChanged={(e) => setStartLoc(originRef.current.value)}>
                        <input onChange={() => setStartLoc('')} placeholder="Start" ref={originRef}/>
                    </Autocomplete>
                </div>

                <div className="flex-inline">
                    <PinDestination className="waypoint-svg" size={24}/>
                    <Autocomplete onPlaceChanged={(e) => setEndLoc(destinationRef.current.value)}>
                        <input onChange={() => setEndLoc('')} placeholder="End" ref={destinationRef}/>
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

            <div id="checkbox-selector">
                <div className="input-checkbox">
                    <input id="full-flag" checked={fullFlag} onChange={() => setFullFlag(!fullFlag)} type="checkbox"/>
                    <label htmlFor="full-flag">Hide Full Trips</label>
                </div>
                <div className="input-checkbox">
                    <input id="request-flag" checked={requestFlag} onChange={() => setRequestFlag(!requestFlag)} type="checkbox"/>
                    <label htmlFor="request-flag">Hide Requests</label>
                </div>
            </div>

            { currentItems ?
                (currentItems.length !== 0 ? 
                <>
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
                        forcePage={pageNumber}
                    />
                </> : <div id="empty-results-page">
                    <Block size={44} weight="thin"/>
                    <p>Sorry, there are no trips found!</p>
                </div> 
            ) : <></> }
    
        </div>
    )

}

export default Browse