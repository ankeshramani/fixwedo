import React, { useState } from "react";
import { toast } from "react-toastify";
import images from "../../utils/ImageHelper";
import { useFirestore, useFirebase } from "react-redux-firebase";
import Loader from "../CommonComponents/Loader";
import {ApiService} from "../../ApiService";

const CompanyAccount = ({ userDetail, inputChange, imageUpload }) => {
    const firebase = useFirestore();
    const fireStore = useFirebase()
    const [isActive, setActive] = useState(false);
    const [isLoading, setLoader] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const UserId = localStorage.getItem('userId');

    let apiService = new ApiService()
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

    const saveData = async (img) => {
        const { Email, Name, PostCode, telephone, UserName, FullName, AboutUs, ProfileImage, Password, UserType, OrganizationNo, Address, ConfirmPassword, IsActivated, IsLogin, LoginIp, CompanyName } = userDetail
        if (ConfirmPassword !== Password) {
            setConfirmPasswordError("Password and Confirm Password is not valid")
            setActive(true)
            setLoader(false)
        } else {
            setConfirmPasswordError("")
            const payload = {
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
                OrganizationNo,
                Address,
                IsActivated,
                IsLogin,
                LoginIp,
                CompanyName
            }
            const res = await apiService.updateUserDetails(payload, UserId)
            if(res.status){
                setActive(false)
                setLoader(false)
                const obj = {
                    AboutUs: AboutUs,
                    Address: Address,
                    CompanyName: CompanyName,
                    Email: Email,
                    FullName: FullName,
                    IsActivated: IsActivated,
                    IsLogin: IsLogin,
                    LoginIp: LoginIp,
                    Name: Name,
                    OrganizationNo: OrganizationNo,
                    Password: Password,
                    PostCode: PostCode,
                    ProfileImage: ProfileImage,
                    UserName: UserName,
                    UserType: UserType,
                    id: UserId,
                    telephone: telephone,
                }
                localStorage.setItem('userDetails',JSON.stringify(obj))
                toast.success("Profile updated successfully");
            } else {
                setActive(false)
                setLoader(false)
                toast.error("Something went wrong please try again");
            }
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
                            <img src={userDetail.Base64 || userDetail.ProfileImage || images.avatarImg} />
                        </div>
                        <div className="upload-profile">
                            <i className="fas fa-plus" style={{display: !isActive ? 'none' : 'block'}} />
                            <input type="file" name="Image" accept='image/*' className="upload-profile-box" onChange={imageUpload} />
                        </div>
                    </div>
                    <div className="profile-status">
                        <div className="profile-content">
                            {
                                !isActive ? <h4>{userDetail.FullName || "-"}</h4> :
                                    <div className="row">
                                        <div className="number-box">
                                            <input
                                                type="text"
                                                name="FullName"
                                                placeholder="Full name"
                                                value={userDetail.FullName}
                                                onChange={inputChange} />
                                        </div>
                                        <button disabled={isLoading}  onClick={() => submitData()}><a className={isActive ? "edit-profile" : ""}>
                                            Save Profile
                                        </a></button>
                                    </div>
                            }
                            {!isActive && <a className="edit-btn" onClick={() => updateBtn()}>  Hantera profil </a>}
                            {
                                !isActive ? <p>{userDetail.AboutUs || "-"}</p> :
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
                        {/*<div className="toggle-main-wrapper">
                             <div className="toggle-view">
                                <div className="togglebox">
                                    <input id="c" type="checkbox" disabled/>
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
                            <div className="college-right">
                                <h4>Colleagues<span>|</span>23 <i className="fas fa-chevron-right"></i></h4>
                            </div>
                        </div>*/}
                        {
                            !isActive ?
                                <div className="orgbox-main">
                                    <div className="org-box-right">
                                        <h6>Organisations nr. <span>{userDetail.OrganizationNo || "-"}</span></h6>
                                    </div>
                                    <div className="org-box-mail">
                                        <a href={"mailto:" + userDetail.Email}>{userDetail.Email || "-"}</a>
                                    </div>
                                </div> : <div className="row space-wrapper">
                                    <div className="col-md-6">
                                        <div className="tiltitle">
                                            <h5>Organisations nr.</h5>
                                        </div>
                                        <div className="number-box">
                                            <input type="number" name="OrganizationNo" value={userDetail.OrganizationNo} onChange={inputChange} placeholder="15 52 65 35 45 65 88" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="tiltitle">
                                            <h5>Emailadress</h5>
                                        </div>
                                        <div className="number-box">
                                            <input type="text" name="Email" value={userDetail.Email} onChange={inputChange} placeholder="virginia.m1@xyz.com" disabled />
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            !isActive ? <div className="orgbox-main">
                                    <div className="org-box-right">
                                        <h6>Företagsnamn <span>{userDetail.CompanyName}</span></h6>
                                    </div>
                                    <div className="org-box-right org-box-mail">
                                        <h6>Telefonnummer <span><a className="pl-0" href={"mailto:" + userDetail.telephone}>{userDetail.telephone}</a></span></h6>
                                    </div>
                                </div> :
                                <div className="row space-wrapper ">
                                    <div className="col-md-6">
                                        <div className="tiltitle">
                                            <h5>Företagsnamn</h5>
                                        </div>
                                        <div className="number-box">
                                            <input type="text" name="CompanyName" value={userDetail.CompanyName}
                                                   onChange={inputChange}
                                                   placeholder="Company Name"/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="tiltitle">
                                            <h5>Telefonnummer</h5>
                                        </div>
                                        <div className="number-box">
                                            <input type="number" name="telephone" placeholder="+1 xxxxxxxxxx" value={userDetail.telephone} onChange={inputChange} />
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            !isActive ? <div className="address-box">
                                <div className="address">
                                    <h4>Adress </h4>
                                </div>
                                <div className="w-100 address-content">
                                    <p>{userDetail.Address}</p>
                                </div>
                            </div> : <div className="row space-wrapper ">
                                    <div className="col-12">
                                        <div className="tiltitle">
                                            <h5>Adress</h5>
                                        </div>
                                        <div className="number-box">
                                            <input type="text" name="Address" value={userDetail.Address} onChange={inputChange} placeholder="Virginia Mowers, Andrew Squar..." />
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            isActive && <div className="row space-wrapper mb-0">
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
                                    {confirmPasswordError && <p className="text-danger mt-2">{confirmPasswordError}</p>}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyAccount