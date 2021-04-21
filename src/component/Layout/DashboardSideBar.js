import React, { useState } from "react";
import images from "../../utils/ImageHelper";
import {Link, useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {useFirebase, useFirestore, withFirestore} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";

const DashboardSideBar = ({ userDetails, notificationList, chatsDetails }) => {
    var URL = window.location.href;
    var URLSplit = URL.split('/');
    let history = useHistory();
    const [active, setActive] = useState(URLSplit[3]);
    const [offerDataListPrivate, setOfferDataListPrivate] = useState([]);
    const [userMessageList, setUserMessageList] = useState([]);
    const [offerDataListCompany, setOfferDataListCompany] = useState([]);
    const [companyMessageList, setCompanyMessageList] = useState([]);
    const fireStore = useFirestore();
    const sendBy = localStorage.getItem('userId')
    const userId = localStorage.getItem('userId')
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}

    React.useEffect(() => {
        let clone = [...notificationList]
        if(userInfo && userInfo.UserType === "private") {
            const filterData = (clone || []).filter((x) =>  x.userId ===  userId)
            const filterRedNotification  = (filterData || []).filter((y) => y.isRead === false);
            const newOfferData = (filterRedNotification || []).filter((j) => j.notificationType === "payment")
            const userClone = [...newOfferData]
            setOfferDataListPrivate(userClone)
            if((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)){
                const companyMessage = []
                const chetWithCompany = chatsDetails.filter((l) => l.userId === userId);
                // eslint-disable-next-line array-callback-return
                chetWithCompany.map((x) => {
                    // eslint-disable-next-line array-callback-return
                    userDetails.map((y) => {
                        if(x.companyId === y.id){
                            const receivedMessage = x && x.chat ? (x.chat || []).filter((z) => z.sendTo === userId && z.isRead === false) : [];
                            const lastMessage = receivedMessage.sort((a, b) => (b.messageDate) - (a.messageDate)) || [];
                            (lastMessage || []).map((p) => {
                                const obj = {
                                    userName: y.FullName || y.UserName,
                                    ProfileImage: y.ProfileImage,
                                    messageCount: receivedMessage && receivedMessage.length,
                                    lastMessage: p,
                                    projectId: x.projectId,
                                    companyId: x.companyId,
                                    chetId: x.id
                                }
                                companyMessage.push(obj)
                            })
                        }
                    })
                })
                setUserMessageList(companyMessage)
                console.log("companyMessage",companyMessage)
            }

        } else {
            const filterData = (clone || []).filter((x) => x.companyId === userId)
            const filterRedNotificationCompany = (filterData || []).filter((y) => y.isRead === false)
            const acceptedOfferData = (filterRedNotificationCompany || []).filter((y) => y.notificationType === "cancelChat")
            const companyClone = [...acceptedOfferData]
            setOfferDataListCompany(companyClone)
            if((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)){
                const companyMessage = []
                const chetWithCompany = chatsDetails.filter((l) => l.companyId === userId);
                chetWithCompany.map((x) => {
                    userDetails.map((y) => {
                        if(x.userId === y.id){
                            const receivedMessage = x && x.chat ? (x.chat || []).filter((z) => z.sendTo === userId && z.isReadCompany === false) : [];
                            const lastMessage = receivedMessage.sort((a, b) => (b.messageDate) - (a.messageDate)) || [];
                            (lastMessage || []).map((p) => {
                                const obj = {
                                    userName: y.FullName || y.UserName,
                                    ProfileImage: y.ProfileImage,
                                    messageCount: receivedMessage && receivedMessage.length,
                                    lastMessage: p,
                                    projectId: x.projectId,
                                    userId: x.userId,
                                    chetId: x.id
                                }
                                companyMessage.push(obj)
                            })
                        }
                    })
                })
                setCompanyMessageList(companyMessage)

            }
        }
    }, [notificationList, chatsDetails, userDetails]);

    React.useEffect(() => {
        fireStore.setListeners([
            {
                collection: 'tblUser',
                storeAs: 'userDetails'
            },
        ])
    }, [fireStore])

    const logout = () => {
        const loginUser = userDetails.find((x) => x.id === sendBy)
        fireStore.collection("tblUser").doc(loginUser.id).set({
            ...loginUser,
            IsLogin: false,
        }).then((res) => {
            localStorage.removeItem("userId");
            localStorage.removeItem("userDetails");
            history.push('/')
        }).catch((e) => {
        })

    }
    // const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
    const userType = (userInfo && userInfo.UserType)

    const notificationCount = userInfo && userInfo.UserType === "private" ? ((offerDataListPrivate.length) +  (userMessageList.length)) : ((offerDataListCompany.length) +  (companyMessageList.length))
    // export default function DashboardSideBar() {
    return (
        <div id="menu_sidebar" className="sidebar">
            <div className="menu-sidebar-inner">
                <div className="post-job-btn">
                    <Link to="/postajob">Publicera uppdrag</Link>
                </div>
                <ul className="nav side-nav">
                    <li className={` ${active === "dashboard" ? 'active' : ""}`} onClick={() => setActive("dashboard")}>
                        <Link to={userType === "private" ? "/dashboard" : "/company/dashboard"}><img src={images.jobs} alt="Posted jobs"/> Publicerade uppdrag</Link>
                    </li>
                    <li className={` ${active === "Offers" ? 'active' : ""}`} >
                        <Link to={userType === "private" ? "/Offers" : "/company/company-offers"}><img src={images.offers} alt="Offers"/>
                            <span className="offer-count">
                            Meddelanden <label className="bage">{notificationCount}</label>
                            </span>
                        </Link>
                    </li>
                    <li className={` ${active === "settings-account" ? 'active' : ""}`} onClick={() => setActive("settings-account")}>
                        <Link to={userType === "private" ? "/settings-account" : "/company/settings-account"}><img src={images.settings1} alt="Settings"/> Settings</Link>
                    </li>
                </ul>
            </div>
            <div className="logout">
                <a className="mb-0"  onClick={() => logout()}><img src={images.logout} alt="img"/></a>
            </div>
        </div>
    );
}
export default compose(
    withFirestore,
    connect((state) => ({
        userDetails: (state.firestore.ordered && state.firestore.ordered.userDetails) || [],
        notificationList: (state.firestore.ordered && state.firestore.ordered.notificationList) || [],
        chatsDetails: (state.firestore.ordered && state.firestore.ordered.chatsDetails) || [],
    }))
)(DashboardSideBar)
