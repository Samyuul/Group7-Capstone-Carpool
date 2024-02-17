import "./user.css"
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const User = (props) => {

    const { username } = useParams();
    const [reviews, setReviews] = useState(["qwer", "asdf", "zxcv", "fghj", "rtyu"]);

    const renderReviews = () => {

        return(
            reviews.map((val, i) => {
                return(
                    <div className="review">
                        <h4>{val}</h4>
                        <h4>This is a test review!!!</h4>
                        <h5>4.5 / 5</h5>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed placerat lectus, at porta risus. Cras 
                            scelerisque lobortis imperdiet. Cras rutrum tortor nec enim dictum, at lacinia sapien pharetra. Nunc congue 
                            sagittis nunc sit amet iaculis.                     
                        </p>
                    </div>
                )
            })
        )
    }

    return (

        <div id="profile-page">
            
            <div id="profile-header">
                <div id="profile-image">Image</div>
                <h1>{username}</h1>
            </div>

            <h3>Gender: Male</h3>
            <h3>Age: 30</h3>
            <h3>About me</h3>
            <p id="profile-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed placerat lectus, at porta risus. Cras 
                scelerisque lobortis imperdiet. Cras rutrum tortor nec enim dictum, at lacinia sapien pharetra. Nunc congue 
                sagittis nunc sit amet iaculis. Morbi pellentesque eget nisl sit amet condimentum. Aliquam sit amet tempor tellus.
                In interdum mauris vitae molestie tempor. Vestibulum quis purus quam.
            </p>

            <h2>Reviews</h2>
            <div id="review-section">

                {renderReviews()}

            </div>
        </div>
    
    )

}

export default User

