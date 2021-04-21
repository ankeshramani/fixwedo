import React, { useState } from "react";
import { toast } from "react-toastify";
import images from "../../utils/ImageHelper";
import { useFirestore, useFirebase } from "react-redux-firebase";
import Loader from "../CommonComponents/Loader";

const Account = ({ userDetail, inputChange, imageUpload }) => {
    const firebase = useFirestore();
    const fireStore = useFirebase()
    const [isActive, setActive] = useState(false);
    const [isLoading, setLoader] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const updateBtn = () => {
        setActive(!isActive)
    }

    const submitData = () => {
        const { ProfileImage } = userDetail
        setLoader(true)
        if (userDetail.Base64) {
            fireStore.uploadFile('/image', ProfileImage).then((data) => {
                data.uploadTaskSnapshot.ref.getDownloadURL().then(function (downloadURL) {
                    saveData(downloadURL)
                });
            })
        } else {
            saveData()
        }
    }

    const saveData = (img) => {
        const { Email, Name, PostCode, telephone, UserName, FullName, AboutUs, ProfileImage, Password, UserType, ConfirmPassword, IsActivated, IsLogin, LoginIp, Address, OrganizationNo, CompanyName } = userDetail
        if (ConfirmPassword !== Password) {
            setConfirmPasswordError("Password and Confirm Password is not valid")
            setActive(true)
            setLoader(false)
        } else {
            firebase.collection("tblUser").doc(userDetail.id).set({
                Email,
                Name,
                PostCode,
                telephone,
                UserName,
                FullName,
                AboutUs,
                ProfileImage: img || ProfileImage,
                Password,
                UserType,
                IsActivated,
                IsLogin,
                LoginIp,
                Address,
                OrganizationNo,
                CompanyName
            }).then((doc) => {
                toast.success("Profile updated successfully");
                setActive(false)
                setLoader(false)
            }).catch(error => {
                setLoader(false)
                toast.error("Something went wrong please try again");
            });
        }
    }

    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="profile-main-wrapper">
            <div className="profile-title">
                <h4>Välkommen tillbaka, <span>{userDetail.FullName}</span></h4>
            </div>
            <div className="profile-box-wrapper">
                <div className="profile-inner-box">
                    <div className={`profilebox ${isActive ? "edit-profile-img" : ""}`}>
                        <div className="profile-upload">
                            <img src={userDetail.Base64 || userDetail.ProfileImage || images.avatarImg} alt="logo" />
                        </div>
                        <div className="upload-profile">
                            <i className="fas fa-plus"  style={{display: !isActive ? 'none' : 'block'}} />
                            <input type="file" name="Image" accept="image/*" onChange={imageUpload} className="upload-profile-box" />
                        </div>
                    </div>
                    <div className="profile-status">
                        <div className="profile-content">
                            {
                                !isActive ? <h4>{userDetail.FullName}</h4> :
                                    <div className="row">
                                        <div className="number-box">
                                            <input
                                                type="text"
                                                name="FullName"
                                                placeholder="Full name"
                                                value={userDetail.FullName}
                                                onChange={inputChange} />
                                        </div>
                                        <a className={isActive ? "edit-profile" : ""} href="#" onClick={() => submitData()}>Save Profile</a>
                                    </div>
                            }
                            {!isActive && <a href="#" className="edit-btn" onClick={() => updateBtn()}> Ändra profil </a>}

                            {
                                !isActive ? <p>{userDetail.AboutUs}</p> :
                                    <div className="number-box">
                                        <textarea
                                            name="AboutUs"
                                            id="kort_beskrivning"
                                            value={userDetail.AboutUs}
                                            onChange={inputChange}
                                            className="form-control"
                                            placeholder="Kort beskrivning"
                                        />
                                    </div>
                            }
                        </div>
                        {/* <div className="toggle-main-wrapper mb-0"> */}
                            {/*{
                                userDetail.UserType &&
                                <div className="toggle-view">
                                    <div className="togglebox">
                                        <input id="c" type="checkbox" disabled />
                                        <label htmlFor="c">
                                            {
                                                userDetail.UserType === "company" &&
                                                <div className="toggle-swich" data-unchecked="Company" data-checked="Private" />
                                            }
                                            {
                                                userDetail.UserType === "private" &&
                                                <div className="toggle-swich" data-checked="Company" data-unchecked="Private" />
                                            }
                                        </label>
                                    </div>
                                </div>
                            }*/}
                        {/* </div> */}
                            {
                                !isActive ?
                                    <div className="address-confimbox">
                                        <a href={"mailto:" + userDetail.Email}>{userDetail.Email}</a>
                                        <a href={"tel:" + userDetail.telephone}>{userDetail.telephone}</a>
                                    </div> :
                                    <div className="private-edit-profile-bottom mt-0">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="number-box">
                                                    <input
                                                        type="text"
                                                        name="Email"
                                                        value={userDetail.Email}
                                                        onChange={inputChange} disabled />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="number-box">
                                                    <input type="number"
                                                        name="telephone"
                                                        placeholder="mobile no"
                                                        value={userDetail.telephone}
                                                        onChange={inputChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                isActive &&
                                <div className="private-edit-profile-bottom">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="tiltitle">
                                                <h5>Nytt lösenord</h5>
                                            </div>
                                            <div className="number-box">
                                                <input type="password" name="Password" value={userDetail.Password} onChange={inputChange} placeholder=". . . . . . . ." />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="tiltitle">
                                                <h5>Bekräfta lösenord</h5>
                                            </div>
                                            <div className="number-box mb-0">
                                                <input type="password" name="ConfirmPassword" value={userDetail.ConfirmPassword} onChange={inputChange} placeholder=". . . . . . . ." />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            {confirmPasswordError && <p className="text-danger">{confirmPasswordError}</p>}
                                        </div>
                                    </div>
                                </div>
                            }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Account;