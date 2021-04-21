import React, { useState }  from "react";
import images from "../../utils/ImageHelper";
import {useLocation, Link, useHistory} from 'react-router-dom';
import {compose} from "redux";
import {useFirestore, withFirestore} from "react-redux-firebase";
import {connect} from "react-redux";
import {ApiService} from "../../ApiService";
import {toast} from "react-toastify";

const CompanySideBar = ({userDetails, notificationList, chatsDetails}) =>  {
    const fireStore = useFirestore();
    const [offerDataListPrivate, setOfferDataListPrivate] = useState([]);
    const [userMessageList, setUserMessageList] = useState([]);
    const [offerDataListCompany, setOfferDataListCompany] = useState([]);
    const [companyMessageList, setCompanyMessageList] = useState([]);
    let history = useHistory();
    const sendBy = localStorage.getItem('userId')
    const userId = localStorage.getItem('userId')
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
    var URL = window.location.href;
    var URLSplit = URL.split('/');
    let apiService = new ApiService()
    React.useEffect(() => {
        fireStore.setListeners([
            {
                collection: 'tblUser',
                storeAs: 'userDetails'
            },
        ])
    }, [fireStore])

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

    const logout = async () => {
        const payload = {
            ...userInfo,
        }
        const data = await apiService.logout(payload)
        if(data.status) {
            localStorage.removeItem("userId");
            localStorage.removeItem("userDetails");
            toast.success('Logout successfully')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        /*firebase.collection("tblUser").doc(userInfo.id).set({
            ...userInfo,
            IsLogin: false,
        }).then((res) => {
            window.location.reload()
            localStorage.removeItem("userId");
            localStorage.removeItem("userDetails");
        }).catch((e) => {
        })*/
    }

    const location = useLocation();
    const pathname = location.pathname;
    const [active, setActive] = useState(pathname);
    const totalNotification = userInfo && userInfo.UserType === "private" ? ((offerDataListPrivate.length) +  (userMessageList.length)) : ((offerDataListCompany.length) +  (companyMessageList.length))
    return (
        <div id="menu_sidebar" className="sidebar">
            <ul className="nav side-nav menu-sidebar-inner">
                <li className={` ${active === "/company/dashboard" ? 'active' : ""}`} onClick={() => setActive("/company/dashboard")}>
                    <Link to="/company/dashboard"><img src={images.jobs} alt="Jobs"/> Uppdrag</Link>
                </li>
                {/*<li className={` ${active === "/company/company-offers" ? 'active' : ""}`} onClick={() => setActive("/company/companyoffers")}>
                    <Link to="/company/company-offers"><img src={images.offers} alt="Offers"/><span className="offer-count">Meddelanden <label className="bage">{totalNotification}</label></span></Link>
                </li>*/}
                <li className={` ${active === "/company/settings-account" ? 'active' : ""}`} onClick={() => setActive("/company/settings-account")}>
                    <Link to="/company/settings-account" className="mb-0"><img src={images.settings1} alt="Settings"/> Inställningar</Link>
                </li>
            </ul>
            <div className="logout">
                <a className="mb-0" onClick={() => logout()}><img src={images.logout} alt="logout"/></a>
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
)(CompanySideBar)