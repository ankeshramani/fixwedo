import React, { useEffect, useState } from "react";
import { isLoaded, withFirestore, useFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import {connect, useDispatch} from 'react-redux';
import Dashboardheader from '../Layout/DashboardHeader';
// import Dashboardsidebar from '../Layout/DashboardSideBar';
import CompanySideBar from '../Layout/CompanySideBar';
import CompanyAccount from "./CompanyAccount";
import Paybilling from "./Paybilling";
import Faq from "./Faq";
import Account from "./Account";
import CompanySettingsAccountEditColleagues from "../Company/CompanySettingsAccountEditColleagues";
import * as actions from '../../redux/action/actions';
import GetPayment from "./GetPayment";
import {ApiService} from "../../ApiService";

const initialState = {
    FullName: "-",
    ProfileImage: "",
    Base64: "",
    AboutUs: "-",
    UserType: 'private',
    OrganizationNo: '-',
    Address: '-',
    telephone: '-',
    ConfirmPassword: "-",
    CompanyName:"-",
    Email:"-",
    Name:"-",
    Password:"-",
    UserName:'-',
}

const CompanySettingAccount = () => {
    const [active, setActive] = useState("account");
    const [userDetail, setUserDetails] = useState(initialState);
    let apiService = new ApiService()
    const UserId = localStorage.getItem('userId')

    React.useEffect(() => {
       /* var doctblUser = firebase.collection("tblUser").doc(UserId);
        doctblUser.get()
            .then(function (querySnapshot) {
                if (querySnapshot.exists) {
                    const data = querySnapshot.data();
                    data.id = querySnapshot.id;
                    let merged = { ...initialState, ...data, ConfirmPassword: data.Password};
                    setUserDetails(merged)
                    console.log("Document data:", data);
                } else {
                    // doc.data() will be undefined in this case
                    console.error("No such document!");
                }
                dispatch(actions.setLoader(false));
                // querySnapshot.forEach(function (doc) {
                //     const data = doc.data();
                //     data.id = doc.id
                //     let merged = { ...initialState, ...data };
                //     setUserDetails(merged)
                // });
            }).catch(function (error) {
            console.error("Error getting documents: ", error);
        });*/
        getUserDetails()
    }, [])

    const getUserDetails = async () => {
        const res = await apiService.getUserDetails(UserId)
        if(res.status){
            setUserDetails({...initialState, ...res.data,ConfirmPassword: res.data.Password} )
        }
    }



    const inputChange = (e) => {
        const { name, value } = e.target
        setUserDetails(userDetail => ({
            ...userDetail,
            [name]: value
        }));
    }

    const imageUpload = (event) => {
        const image = event.target && event.target.files[0]
        let reader = new FileReader();
        reader.onload = e => {
            setUserDetails(userDetail => ({
                ...userDetail,
                Base64: e.target.result,
                ProfileImage: image
            }));
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    return(
        <div id="wrapper">
            <Dashboardheader/>
            <CompanySideBar/>
            <div className="setting-wrapper company-dashboard">
                <div className="row" style={{margin:"0", height:"100%"}}>
                    <div className="col-md-4" style={{padding:"0"}}>
                        <div className="setting-box">
                            <div className={`setting-side-box ${active === "account" ? 'profile-tab-active' : ""}`} onClick={() => setActive("account")}>
                                <a className="setting-img">
                                    <i className="fas fa-user"/>
                                </a>
                                <div className="setting-box-body">
                                    <h5><a>Konto </a></h5>
                                    <h6>Se och ändra dina kontouppgifter</h6>
                                </div>
                            </div>
                            <div className={`setting-side-box ${active === "payout" ? 'profile-tab-active' : ""}`} onClick={() => setActive("payout")}>
                                <a className="setting-img">
                                    <i className="fas fa-wallet"/>
                                </a>
                                <div className="setting-box-body">
                                    <h5><a>Betalning </a></h5>
                                    <h6>Lägg till och hantera kortuppgifter för betalning</h6>
                                </div>
                            </div>
                            {/*<div className={`setting-side-box ${active === "colleagues" ? 'profile-tab-active' : ""}`} onClick={() => setActive("colleagues")}>
                                <a className="setting-img">
                                    <i className="fas fa-wallet"/>
                                </a>
                                <div className="setting-box-body">
                                    <h5><a>Colleagues</a></h5>
                                    <h6>Manage Colleagues</h6>
                                </div>
                            </div>*/}
                            {/*<div className={`setting-side-box ${active === "faq" ? 'profile-tab-active' : ""}`} onClick={() => setActive("faq")}>
                                <a className="setting-img">
                                    <i className="fas fa-question-circle"/>
                                </a>
                                <div className="setting-box-body">
                                    <h5><a>FAQ</a></h5>
                                    <h6>Vanliga frågor </h6>
                                </div>
                            </div>*/}
                            {/*<div className={`setting-side-box ${active === "getPayment" ? 'profile-tab-active' : ""}`} onClick={() => setActive("getPayment")}>
                                <a className="setting-img">
                                    <i className="fas fa-wallet"/>
                                </a>
                                <div className="setting-box-body">
                                    <h5><a>Get My Payment</a></h5>
                                    <h6>Get Payment</h6>
                                </div>
                            </div>*/}
                        </div>
                    </div>
                    <div className="col-md-8" style={{padding:"0"}}>
                        {active === "account" && <CompanyAccount userDetail={userDetail} imageUpload={imageUpload} inputChange={inputChange}/>}
                        {active === "payout" && <Paybilling />}
                        {/* {active === "colleagues" && <CompanySettingsAccountEditColleagues/>}*/}
                        {/*{active === "faq" && <Faq />}
                        {active === "getPayment" && <GetPayment />}*/}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default compose(
    withFirestore,
    connect((state) => ({
        authInfo: (state.firebase.auth) || [],
    }))
)(CompanySettingAccount)