import "./browse.css"
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Browse = (props) => {

    const [postings, setPostings] = useState(['dafsa', 'davsadd', 'yeays', 'bffr', 'fdasf', 'esfav', 'feavd', 'aewae', 'fdasvd']);

    const renderPostings = () => {

        return (
            postings.map((val, i) => {
                return (
                    <div key={i} className="posting">
                        <h3>Test {i}</h3>

                        <p>This is a test post</p>
                        <p>Posted by: Bob</p>

                        <Link to={"/post/view/" + val}>
                            View 
                        </Link>
                    </div>
                )
            })
        )
    }
    
    return (
        <div id="browse-page">
            {renderPostings()}
        </div>
    )

}

export default Browse