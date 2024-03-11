import React, { useEffect, useState } from "react";
import "./editProfile.css";

import { 
    CakeSlice,
    Account,
    Notebook,
    MaleFemale,
    ImageGallery
} from '@vectopus/atlas-icons-react';

const EditProfile = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [desc, setDesc] = useState("");
    const [gender, setGender] = useState("");

    const submitProfile = () => {
        console.log("submitProfile");
    }

    // Initially load values
    useEffect(() => {
        const profileData = {
            firstName: "Sarah",
            lastName: "Smith",
            joined: "Sept 18, 2023",
            tripDriver: 7,
            tripPassenger: 3,
            tripDistance: 54.2,
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed placerat lectus, at porta risus. Cras scelerisque lobortis imperdiet. Cras rutrum tortor nec enim dictum, at lacinia sapien pharetra. Nunc congue sagittis nunc sit amet iaculis. Morbi pellentesque eget nisl sit amet condimentum. Aliquam sit amet tempor tellus. In interdum mauris vitae molestie tempor. Vestibulum quis purus quam.",
            passengerRating: 4.3,
            driverRating: 4.5,
            gender: "Female",
            day: 12,
            month: 4,
            year: 1996
        }
        
        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setDay(profileData.day);
        setMonth(profileData.month);
        setYear(profileData.year);
        setDesc(profileData.desc);
        setGender(profileData.gender);
    }, []);

    return (
        <div id="edit-profile">
            <div id="profile-inputs">

                <label htmlFor="first-name-input">First Name: </label>
                <div className="profile-input-txt">
                    <Account size={24}/>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} id="first-name-input"/>
                </div>

                <label htmlFor="last-name-input">Last Name: </label>
                <div className="profile-input-txt">
                    <Account size={24}/>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} id="last-name-input"/>
                </div>

                <label>Date of Birth: </label>
                <div className="profile-input-txt">
                        <CakeSlice size={24}/>
                        <input value={day} onChange={(e) => setDay(e.target.value)} id="profile-day" placeholder="Day"/>
                        <CakeSlice size={24}/>
                        <input value={month} onChange={(e) => setMonth(e.target.value)} id="profile-month" placeholder="Month"/>
                        <CakeSlice size={24}/>
                        <input value={year} onChange={(e) => setYear(e.target.value)} id="profile-year" placeholder="Year"/>
                </div>

                <label htmlFor="profile-desc-input">Description: </label>
                <div className="profile-input-txt">
                    <Notebook size={24}/>
                    <div className="textarea-container">
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} id="profile-desc-input" className="textarea-style"/>
                    </div>
                </div>

                <label htmlFor="gender-select">Gender: </label>
                <div className="profile-input-txt">
                    <MaleFemale size={24} />
                    <select onChange={(e) => setGender(e.target.value)}
                        id="gender-select" value={gender}>
                        <option value="">--- Select ---</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <label>Profile Image</label>
                <div className="profile-input-txt">
                    <ImageGallery size={24} weight="bold"/>
                    <input/>
                    <button className="trip-btn">Upload</button>
                </div>

                <button onClick={() => submitProfile()} className="trip-btn">Update Profile</button>
            </div>
        </div>
    )

}

export default EditProfile