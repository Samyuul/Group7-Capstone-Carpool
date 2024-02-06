import "./browse.css"
import React, { useState } from 'react';

const Browse = (props) => {

    const [postings, setPostings] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const renderPostings = () => {

        return (
            postings.map((val, i) => {
                return (
                    <div className="posting">
                        <h3>Test {i}</h3>

                        <p>This is a test post</p>
                        <p>Posted by: Bob</p>

                        <button>
                            Join Now!
                        </button>
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