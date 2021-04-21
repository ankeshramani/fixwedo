import React, { useState } from "react";
import { withFirestore, useFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import {connect, useDispatch} from 'react-redux';
import Dashboardheader from '../Layout/DashboardHeader';
import Dashboardsidebar from '../Layout/DashboardSideBar';
import Account from "./Account";
import Paybilling from "./Paybilling";
import Faq from "./Faq";
import * as actions from "../../redux/action/actions";

const initialState = {
    FullName: "-",
    ProfileImage: "",
    Base64: "",
    AboutUs: "-",
    ConfirmPassword: ""
}

const SettingsAccount = ({ authInfo }) => {
    const [active, setActive] = useState("account");
    const [userDetail, setUserDetails] = useState(initialState);
    const firebase = useFirestore();
    const dispatch = useDispatch();

    React.useEffect(() => {
        const UserId = localStorage.getItem('userId')
        dispatch(actions.setLoader(true));
        var doctblUser = firebase.collection("tblUser").doc(UserId);
        doctblUser.get()
            .then(function (querySnapshot) {
                if (querySnapshot.exists) {
                    const data = querySnapshot.data();
                    data.id = querySnapshot.id;
                    let merged = { ...initialState, ...data, ConfirmPassword: data.Password};
                    setUserDetails(merged)
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
            });
    }, [])

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
    return (
        <div id="wrapper">
            <Dashboardheader/>
            <Dashboardsidebar/>
            <div className="setting-wrapper">
                <div className="setting-box">
                    <div className={`setting-side-box ${active === "account" ? 'profile-tab-active' : ""}`} onClick={() => setActive("account")}>
                        <a className="setting-img">
                            <i className="fas fa-user" />
                        </a>
                        <div className="setting-box-body">
                            <h5><a>Konto</a></h5>
                            <h6>Se och ändra dina kontouppgifter</h6>
                        </div>
                    </div>
                    {/*<div className={`setting-side-box ${active === "payout" ? 'profile-tab-active' : ""}`} onClick={() => setActive("payout")}>*/}
                    {/*    <a className="setting-img" >*/}
                    {/*        <i className="fas fa-wallet" />*/}
                    {/*    </a>*/}
                    {/*    <div className="setting-box-body">*/}
                    {/*        <h5><a>Payout & Billing</a></h5>*/}
                    {/*        <h6>Setm up and Manage Payment & Billing Method</h6>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className={`setting-side-box ${active === "faq" ? 'profile-tab-active' : ""}`} onClick={() => setActive("faq")}>
                        <a className="setting-img">
                            <i className="fas fa-question-circle" />
                        </a>
                        <div className="setting-box-body">
                            <h5><a>FAQ</a></h5>
                            <h6>Vanliga frågor</h6>
                        </div>
                    </div>
                </div>
                {active === "account" &&
                    userDetail.Email &&
                    <Account
                        userDetail={userDetail}
                        imageUpload={imageUpload}
                        inputChange={inputChange} />}
                {/*{active === "payout" && <Paybilling />}*/}
                {active === "faq" && <Faq />}
            </div>
        </div>
    );
}

export default compose(
    withFirestore,
    connect((state) => ({
        authInfo: (state.firebase.auth) || [],
    }))
)(SettingsAccount)