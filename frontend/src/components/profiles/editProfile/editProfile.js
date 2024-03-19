import React, { useEffect, useState } from "react";
import "./editProfile.css";
import { useNavigate } from "react-router-dom";

import { 
    CakeSlice,
    Account,
    Notebook,
    MaleFemale,
    ImageGallery,
    ArrowDownCircle
} from '@vectopus/atlas-icons-react';

import ProfileRoutes from "../../../routes/profileRoutes";

const EditProfile = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [desc, setDesc] = useState("");
    const [gender, setGender] = useState("");

    const [image, setImage] = useState("");

    const navigate = useNavigate();

    const submitProfile = () => {

        var birthDate = new Date(year + "-" + month + "-" + day)

        var ageDiffInMs = Date.now() - birthDate.getTime();
        var ageDate = new Date(ageDiffInMs);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        const newProfile = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            desc: desc,
            gender: gender,
            day: day,
            month: month,
            year: year,
            profileImageData: image,
            userID: localStorage.getItem("userID")
        }

        console.log("submit");

        ProfileRoutes.editProfile(newProfile)
        .then(response => {
            navigate("/profile");
        }).catch(e => {
            console.log(e.message);
        })
        
    }

    const convertToBase64 = (e) => {
        console.log(e);

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            //setImage(reader.result);
            setImage("");
        }

        reader.onerror = (error) => {
            console.log("Error: ", error);
        }
    }

    const getDayDropdown = () => {

        return (
            Array.from(Array(31)).map((val, i) => {

                return (
                    <option key={i} value={i + 1}>{i + 1}</option>
                )
            })
        )
    }

    const getMonthDropdown = () => {

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return (
            Array.from(Array(12)).map((val, i) => {

                return (
                    <option key={i} value={i + 1}>{months[i]}</option>
                )

            })
        )
    }

    const getYearDropdown = () => {

        return (
            Array.from(Array(107), (_, i) => i + 1900).reverse().map((val, i) => {

                return (
                    <option key={i} value={val}>{val}</option>
                )

            })
        )
    }

    // Initially load values
    useEffect(() => {
        
        ProfileRoutes.retrieveProfile({userID:localStorage.getItem("userID")})
        .then((response) => {

            const profileData = response.data;
            setFirstName(profileData.firstName);
            setLastName(profileData.lastName);
            setDay(profileData.day === -1 ? "" : profileData.day);
            setMonth(profileData.month === -1 ? "" : profileData.month);
            setYear(profileData.year === -1 ? "" : profileData.year);
            setDesc(profileData.desc);
            setGender(profileData.gender);
            setImage(profileData.profileImageData);

        }).catch((err) => {
            console.log(err.message);
        })

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
                        <select
                            className="select-dropdown"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}>
                            {getMonthDropdown()}
                        </select>
                        <ArrowDownCircle size={24} className="dropdown-svg"/>
                        
                        <CakeSlice size={24}/>
                        <select
                            className="select-dropdown"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}>
                            {getDayDropdown()}
                        </select>    
                        <ArrowDownCircle size={24} className="dropdown-svg"/>
                        
                        <CakeSlice size={24}/>
                        <select
                            className="select-dropdown"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}>
                            {getYearDropdown()}
                        </select>   
                        <ArrowDownCircle size={24} className="dropdown-svg"/>
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
                    <ArrowDownCircle size={24} className="dropdown-svg"/>
                </div>

                <label>Profile Image</label>
                <div className="profile-input-txt">
                    <ImageGallery size={24} weight="bold"/>
                    <input accept="image/*"
                    type="file"
                    onChange={convertToBase64}/>
                    <button className="trip-btn">Upload</button>
                </div>

                <button onClick={() => submitProfile()} className="trip-btn">Update Profile</button>
            </div>
        </div>
    )

}

export default EditProfile