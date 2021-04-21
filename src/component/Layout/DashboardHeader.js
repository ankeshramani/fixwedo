import React, {useState} from "react";
import images from "../../utils/ImageHelper";
import {useHistory, useLocation} from 'react-router-dom';
import $ from "jquery";
import {useFirestore, withFirestore} from "react-redux-firebase";
import {compose} from "redux";
import {connect, useDispatch} from "react-redux";
import * as actions from "../../redux/action/actions";
import moment from "moment";
import {toast} from "react-toastify";

const DashboardHeader = ({notificationList, chatsDetails, userDetails, }) => {
    const [isToggleNotification, setIsToggleNotification] = useState(false);
    const [offerDataListPrivate, setOfferDataListPrivate] = useState([]);
    const [offerDataListCompany, setOfferDataListCompany] = useState([]);
    const [companyMessageList, setCompanyMessageList] = useState([]);
    const [userMessageList, setUserMessageList] = useState([]);
    const firebase = useFirestore();
    let history = useHistory();
    const userId = localStorage.getItem('userId')
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
    React.useEffect(() => {
        $('body').removeClass('overlay');
        // $('#menu_sidebar').addClass('menu-right-close');
        // $('#menu_sidebar').removeClass('menu-right-open');
        $('#mobile_collapse').click(function () {
            $('#menu_sidebar').toggleClass('menu-right-open');
            $('body').toggleClass('overlay');
            $(this).find('i').toggleClass('fa-toggle-on fa-toggle-off')
        });

        $(window).resize(function () {
            var widthWindow = $(window).width();
            if (widthWindow <= '1199') {
                $('#wrapper').addClass('show');
                $('#menu_sidebar').addClass('menu-right-open');
                $('#mobile_collapse').find('i').removeClass('fa-toggle-on')
                $('#mobile_collapse').find('i').addClass('fa-toggle-off');
            } else {
                $('#wrapper').removeClass('show');
                $('#menu_sidebar').removeClass('menu-right-open');
                $('#mobile_collapse').find('i').addClass('fa-toggle-on')
                $('#mobile_collapse').find('i').removeClass('fa-toggle-off');
            }
        });
        $(window).trigger('resize');
    }, [])
    const location = useLocation();
    const pathname = location.pathname;
    var title = '';
    if (pathname.includes("dashboard") || pathname.includes("postedjobs")) {
        title = 'Uppdrag';
    } else if (pathname.includes("Offers") || pathname.includes("offersaccepted") || pathname.includes("offersconfirmed") || pathname.includes("offersaddextra") || pathname.includes("offersaddedextra") || pathname.includes("offerscompleted") || pathname.includes("offerspayment") || pathname.includes("offersrate") || pathname.includes("offersnewOffer")) {
        title = 'Offers On Jobs ';
    } else if (pathname.includes("postajob")) {
        title = 'Publicera uppdrag';
    } else if (pathname.includes("settings-account") || pathname.includes("companysettingsaccounteditcolleagues") || pathname.includes("companysettings") || pathname.includes("companysettingsaccount") || pathname.includes("companysettingsaccountedit")) {
        title = 'Inställningar';
    } else if (pathname.includes("company-offers") || pathname.includes("companynewoffer") || pathname.includes("companynewofferSent") || pathname.includes("companyoffersaccepted") || pathname.includes("companyoffersconfirmed") || pathname.includes("companyoffersfinish") || pathname.includes("companyoffersfinishedRate") || pathname.includes("companyoffersfinishedSent")) {
        title = 'Aktiva uppdrag';
    } else if (pathname.includes("CompanyPostedJobs")) {
        title = 'Jobs';
    }
    
    React.useEffect(() => {
        firebase.setListeners([
            {
                collection: 'tblNotification',
                storeAs: 'notificationList',
                orderBy:['createdAt', "desc"],
                limit: 1000
            },
            {
                collection: 'tblChatMessage',
                storeAs: 'chatsDetails'
            },
            {
                collection: 'tblUser',
                storeAs: 'userDetails'
            }
        ])

    }, []);

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

    const onToggleNotification = () =>{
        setIsToggleNotification(!isToggleNotification)
    }

    const onUpdate = (record) => {
        if(userInfo && userInfo.UserType === "private"){
            localStorage.setItem("notificationIdPrivate", record.id)
            history.push(`/offers?companyId=${record.companyId}&projectId=${record.projectId}`)
        } else {
            localStorage.setItem("notificationIdCompany", record.id)
            history.push(`/company/company-offers?userId=${record.userId}&projectId=${record.projectId}`)
        }
        setIsToggleNotification(false)
    }

    const onRemoveOffer = (record) => {
        firebase.collection("tblNotification").doc(record.id).delete().then((res) => {

        }).catch((error) => {

        })

    }

    const onRedirectOffer = (x) => {
        if(userInfo && userInfo.UserType === "private"){
            history.push(`/offers?companyId=${x.companyId}&projectId=${x.projectId}`, {...x})
        } else {
            history.push(`/company/company-offers?userId=${x.userId}&projectId=${x.projectId}`, {...x})
        }
    }

    const onRemoveMessage = (record) => {
        if(userInfo && userInfo.UserType === "private"){
            if((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)){
                const chetWithCompany = chatsDetails.filter((l) => l.userId === userId);
                let chetRecord = chetWithCompany.find((y) => y.id === record.chetId)
                let newChat = []
                chetRecord.chat.map((z) => {
                    if(z.messageId === record.lastMessage.messageId){
                        let obj = {
                            ...z,
                            isRead: true
                        }
                        newChat.push(obj)
                    } else {
                        newChat.push(z)
                    }
                })
                const newRecord = {
                    ...chetRecord,
                    chat: newChat
                }
                firebase.collection("tblChatMessage").doc(newRecord.id).set({
                    chat: newRecord.chat,
                    companyId: newRecord.companyId,
                    projectId: newRecord.projectId,
                    userName: newRecord.userName,
                    userId:  newRecord.userId,
                    createdAt: newRecord.createdAt,
                    jobTitle: newRecord.jobTitle || "",
                    jobDescription: newRecord.jobDescription || "",
                    jobImage: newRecord.jobImage || "",
                    updatedDate: new Date()
                })
            }
        } else {
            if((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)){
                const chetWithCompany = chatsDetails.filter((l) => l.companyId === userId);
                let chetRecord = chetWithCompany.find((y) => y.id === record.chetId)
                let newChat = []
                 chetRecord.chat.map((z) => {
                     if(z.messageId === record.lastMessage.messageId){
                         let obj = {
                             ...z,
                             isReadCompany: true
                         }
                         newChat.push(obj)
                     } else {
                         newChat.push(z)
                     }
                 })
                const newRecord = {
                    ...chetRecord,
                    chat: newChat
                }
                firebase.collection("tblChatMessage").doc(newRecord.id).set({
                    chat: newRecord.chat,
                    companyId: newRecord.companyId,
                    projectId: newRecord.projectId,
                    userName: newRecord.userName,
                    userId:  newRecord.userId,
                    createdAt: newRecord.createdAt,
                    jobTitle: newRecord.jobTitle || "",
                    jobDescription: newRecord.jobDescription || "",
                    jobImage: newRecord.jobImage || "",
                    updatedDate: new Date()
                })
            }
        }
    }

    return (
        <nav className="navbar navbar-top navbar-expand-lg navbar-light">
            <div className="navbar-header">
                <a className="navbar-brand" href="/#"><img src={images.logosvg} alt="FixWeDo logo" /></a>
                <a className="mobile-menu" id="mobile_collapse">
                    <i className="fas fa-toggle-on" />
                </a>
            </div>
            <div className="collapse navbar-collapse right-menu">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/#">{title} <span className="sr-only">(current)</span></a>
                    </li>
                </ul>
                <ul className="nav navbar-right top-nav" onClick={(offerDataListPrivate && offerDataListPrivate.length) || (offerDataListCompany && offerDataListCompany.length || (companyMessageList && companyMessageList.length) || userMessageList && userMessageList.length) ? onToggleNotification : null} >
                    <li >
                        <a className="button" ><img src={images.bell} alt="" /><span className="bage">{userInfo && userInfo.UserType === "private" ? ((offerDataListPrivate.length) +  (userMessageList.length)) : ((offerDataListCompany.length) +  (companyMessageList.length))}</span></a></li>
                    <ul className={`show-notification notificationbox show ${isToggleNotification ? 'notification-open' : ''}`}>
                        { userInfo && userInfo.UserType === "private" ? <>
                            {(offerDataListPrivate || []).map((x, i) => {
                                let timeStemp = (x.createdAt && x.createdAt.seconds)
                                return (
                                    <li key={i} onClick={() => onUpdate(x)}>
                                        <h5 className={i === 0 ? "mt-0" : ''}>{x.notificationMessage}
                                            <span>{moment(new Date(timeStemp * 1000)).fromNow(true)} Ago</span></h5><span onClick={() =>onRemoveOffer(x)}><i
                                        className="fas fa-times"/></span>

                                    </li>
                                )
                            })
                            }
                            {(userMessageList || []).map((x, i) => {
                                let timeStemp = (x.lastMessage && x.lastMessage.messageDate && x.lastMessage.messageDate.seconds)
                                const isImage = x.lastMessage.message.includes("googleapis")
                                return (
                                    <li key={i}>
                                        <h5 className={i === 0 ? "mt-0" : ''} onClick={() => onRedirectOffer(x)}>{`New message from ${x.userName}`}
                                            {
                                                isImage ? <><br/><img src={x.lastMessage.message} alt="img" style={{width: 80}}/></>   :  <span style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>{x.lastMessage.message}</span>
                                            }
                                            <span>{moment(new Date(timeStemp * 1000)).fromNow(true)} Ago</span>
                                        </h5>
                                        <span onClick={() =>onRemoveMessage(x)}>
                                            <i className="fas fa-times"/>
                                        </span>

                                    </li>
                                )
                            })
                            }
                            </> : <>
                            {(offerDataListCompany || []).map((x, i) => {
                                let timeStemp = (x.createdAt && x.createdAt.seconds)
                                return (
                                    <li key={i}>
                                            <h5 className={i === 0 ? "mt-0" : ''} onClick={() => onUpdate(x)}>{x.notificationMessage}<span>{moment(new Date(timeStemp * 1000)).fromNow(true)} Ago</span></h5><span onClick={() =>onRemoveOffer(x)}><i
                                        className="fas fa-times"/></span>

                                    </li>
                                )
                            })
                            }
                            {(companyMessageList || []).map((x, i) => {
                                let timeStemp = (x.lastMessage && x.lastMessage.messageDate && x.lastMessage.messageDate.seconds)
                                const isImage = x.lastMessage.message.includes("googleapis")
                                return (
                                    <li key={i}>
                                            <h5 className={i === 0 ? "mt-0" : ''} onClick={() => onRedirectOffer(x)}>{`New message from ${x.userName}`}
                                                {
                                                    isImage ? <><br/><img src={x.lastMessage.message} alt="img" style={{width: 80}}/></>   :  <span style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>{x.lastMessage.message}</span>
                                                }
                                                 <span>{moment(new Date(timeStemp * 1000)).fromNow(true)} Ago</span>
                                            </h5>
                                        <span onClick={() =>onRemoveMessage(x)}>
                                            <i className="fas fa-times"/>
                                        </span>

                                    </li>
                                )
                            })
                            }
                        </>
                        }
                    </ul>
                </ul>
            </div>
        </nav>

    );
}
export default compose(
    withFirestore,
    connect((state) => ({
        notificationList: (state.firestore.ordered && state.firestore.ordered.notificationList) || [],
        chatsDetails: (state.firestore.ordered && state.firestore.ordered.chatsDetails) || [],
        userDetails: (state.firestore.ordered && state.firestore.ordered.userDetails) || [],
    }))
)(DashboardHeader)