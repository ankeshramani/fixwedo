import React, { useState } from "react";
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';
import images from "../../utils/ImageHelper";
import { useFirebase, useFirestore, withFirestore } from "react-redux-firebase";
import { compose } from "redux";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import * as actions from "../../redux/action/actions";
// import ConfirmedOffer from "./Offers/ConfirmedOffer";
// import CompanyOffersRate from "./CompanyOffersRate";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { toast } from "react-toastify";
import ModalsSlider from "../CommonComponents/ModalsSlider";
import ProfileView from "../CommonComponents/ProfileView";

const CompanyOffers = ({ chatsDetails, userDetails, offerList, notificationList, projectMaster, ...props }) => {
    let history = useHistory();
    const firebase = useFirestore();
    const fireStore = useFirebase();
    const dispatch = useDispatch();
    const [dataList, setData] = useState([]);
    // const [paymentInfo, setIsPaymentDone] = useState({});
    const [active, setActive] = useState(0);
    const [message, setMsg] = useState("");
    // const [jobPost, setJobPost] = useState("");
    // const [isRate, setIsRate] = useState(false);
    // const [jobDetails, setJobDetails] = useState("");
    // const [offerAmount, setOfferAmount] = useState("");
    const [userIdMessage, setUserIdMessage] = useState("");
    const [projectIdMessage, setProjectIdMessage] = useState("");
    const [imageList, setImages] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isProfileModalOpen, setProfileModal] = useState(false);
    const chatsList = (dataList[active] && dataList[active].chat) || []
    const activeUser = dataList[active]
    console.log("activeUser==========>", activeUser)
    const sendBy = localStorage.getItem('userId')
    const urlParams = new URLSearchParams(props.location.search);
     const projectId = urlParams.get('projectId') || activeUser && activeUser.projectId;
    // const companyId = urlParams.get('companyId');
    const userId = urlParams.get('userId') || activeUser && activeUser.userId;
    const notificationIdCompany = localStorage.getItem("notificationIdCompany") || ""

    React.useEffect(() => {
        firebase.setListeners([
            {
                collection: 'tblChatMessage',
                storeAs: 'chatsDetails',
                orderBy: ["updatedDate", "desc"],
                limit: 10000
            },
            {
                collection: 'tblUser',
                storeAs: 'userDetails'
            },
            // {
            //     collection: 'tblOffer',
            //     storeAs: 'offerList'
            // },
        ])
        dispatch(actions.setLoader(true));
    }, [firebase])

    React.useEffect(() => {
        firebase.get({
            collection: "tblProjectMaster",
            storeAs: "projectMaster"
        });
    }, []);

    React.useEffect(() => {
        const record = notificationList.find((x) => x.id === notificationIdCompany) || {}
        debugger
        if (record && record.id) {
            firebase.collection("tblNotification").doc(record.id).set({
                ...record,
                isRead: true
            }).then((doc) => {
                localStorage.removeItem("notificationIdCompany")
            }).catch(error => {
                toast.error("Something went wrong please try again");
            });
        }
    }, [notificationIdCompany])

    React.useEffect(() => {
        if(props && props.history && props.history.location && props.history.location.state){
            const data = props.history.location.state
            const filterData = chatsDetails.filter(k => k.companyId === sendBy)
            const dataItem = filterData.map(l => {
                const user = userDetails.find(k => k.id === l.userId)
                if (user && user.Email) {
                    return ({
                        ...l,
                        userName: user.FullName || (user.Email && user.Email.split("@")[0]),
                        profileImage: user.ProfileImage || null
                    })
                }
            }).filter((x) => x)
            let findIndex = dataItem.findIndex((k) => k.userId === data.userId && k.projectId === data.projectId)
            if (findIndex !== -1) {
                setActive(findIndex)
                if (((findIndex !== active) &&  data.userId) || findIndex === 0 &&  data.userId) {
                    readMsg(findIndex, dataItem)
                }
            }
        }
    }, [props && props.history && props.history.location && props.history.location.state])

    React.useEffect(() => {
        if ((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)) {
            const filterData = chatsDetails.filter(k => k.companyId === sendBy)
            const dataItem = filterData.map(l => {
                const user = userDetails.find(k => k.id === l.userId)
                if (user && user.Email) {
                    return ({
                        ...l,
                        userName: user.FullName || (user.Email && user.Email.split("@")[0]),
                        profileImage: user.ProfileImage || null
                    })
                }
            }).filter((x) => x)
            dispatch(actions.setLoader(false));
            if (props.location && props.location.search) {
                const urlParams = new URLSearchParams(props.location.search);
                const userId = urlParams.get('userId');
                const projectId = urlParams.get('projectId');
                let findIndex = dataItem.findIndex((k) => k.userId === userId && k.projectId === projectId)
                if (findIndex !== -1) {
                    setActive(findIndex)
                    // eslint-disable-next-line no-mixed-operators
                    if (((findIndex !== active) && projectId) || findIndex === 0 && projectId) {
                        setUserIdMessage(userId)
                        setProjectIdMessage(projectId)
                        if (userId !== userIdMessage && projectId !== projectIdMessage) {
                            readMsg(findIndex, dataItem)
                        }
                    }
                }
            }
            setData(dataItem.sort((a, b) => (b.updatedDate) - (a.updatedDate)))
            if(dataList && dataList.length > 0){
                if(userId !== dataList[0].userId || projectId !== dataList[0].projectId){
                    setActive(0);
                    history.push(`/company/company-offers?userId=${dataList[0].userId}&projectId=${dataList[0].projectId}`);
                }
            }
        } else {
            dispatch(actions.setLoader(false));
        }
    }, [chatsDetails, userDetails, ])

    React.useEffect(() => {
        return () => {
            firebase.unsetListeners([
                {
                    collection: 'tblChatMessage',
                    storeAs: 'chatsDetails',
                    orderBy: ["updatedDate", "desc"],
                    limit: 10000
                },
                {
                    collection: 'tblUser',
                    storeAs: 'userDetails'
                },
                // {
                //     collection: 'tblOffer',
                //     storeAs: 'offerList'
                // },
            ])
        };
    }, [firebase]);

    const keyPressed = (target) => {
        if ((target && target.charCode) === 13) {
            sendMsg()
        }
    }

    const sendMsg = (downloadURL) => {
        const tempMessage = message
        setMsg("")
        if (downloadURL || message) {
            const details = dataList[active]
            const { projectId, userName, userId, createdAt, companyId, jobTitle, jobDescription, jobImage } = details
            const clone = details.chat ? [...details.chat] : []
            const messageId = clone.length + 1
            const obj = {
                messageDate: new Date(),
                message: downloadURL || tempMessage,
                sendBy: sendBy,
                sendTo: userId,
                isReadCompany: false,
                isRead: false,
                offerId: "",
                messageId: messageId
            }
            clone.push(obj)
            firebase.collection("tblChatMessage").doc(details.id).set({
                chat: clone,
                companyId,
                projectId,
                userName,
                userId,
                createdAt,
                jobTitle: jobTitle || "",
                jobDescription: jobDescription || "",
                jobImage: jobImage || "",
                updatedDate: new Date()
            }).then((doc) => {
                const user = userDetails.find(k => k.id === userId)
                const loginUserDetails = userDetails.find(k => k.id === sendBy)
                if (user && user.IsLogin === false) {
                    sendMail(user, loginUserDetails, jobTitle, tempMessage, companyId, projectId)
                }
                dispatch(actions.setLoader(false));
            }).catch(error => {
                dispatch(actions.setLoader(false));
                console.log("error")
            });

        }
    }

    const sendMail = async (user, loginUserDetails, jobTitle, tempMessage, companyId, projectId) => {
        let response = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${user.Email}&emailName=chat&docId=""&projectTitle=${jobTitle}&name=${loginUserDetails.FullName || loginUserDetails.UserName}&message=${tempMessage}&messageLink=${window.location.origin}/offers?companyId=${companyId}&projectId=${projectId}`, {
            method: "GET",
        });
        response.json().then((res) => {
            console.log("res", res)
        }).catch((e) => {
            console.log("e", e)
        })
    }

    const readMsg = (activeSet, dataItem) => {
        const details = dataItem[activeSet]
        const { projectId, userName, userId, createdAt, companyId, id, jobTitle, jobDescription, jobImage } = details
        if (details && details.chat && details.chat.length) {
            const readData = details.chat.map(item => ({
                ...item,
                isReadCompany: true,
            }))
            firebase.collection("tblChatMessage").doc(id).set({
                chat: readData || [],
                companyId,
                projectId,
                userName,
                userId,
                createdAt,
                jobTitle: jobTitle || "",
                jobDescription: jobDescription || "",
                jobImage: jobImage || "",
                updatedDate: new Date()
            }).then((doc) => {
                dispatch(actions.setLoader(false));
                console.log("success")
            }).catch(error => {
                dispatch(actions.setLoader(false));
                console.log("error")
            });
        }
    }

    // const sendMsgWithOffer = (offer) => {
    //     const details = dataList[active]
    //     const { projectId, userName, userId, createdAt, companyId, jobTitle, jobDescription, jobImage } = details
    //     const cloneData = details.chat ? [...details.chat] : []
    //     const obj = {
    //         messageDate: new Date(),
    //         message: "",
    //         sendBy: sendBy,
    //         sendTo: userId,
    //         isRead: false,
    //         offerId: offer,
    //     }
    //     cloneData.push(obj)
    //     dispatch(actions.setLoader(true));
    //     firebase.collection("tblChatMessage").doc(details.id).set({
    //         chat: cloneData,
    //         companyId,
    //         projectId,
    //         userName,
    //         userId,
    //         createdAt,
    //         jobTitle: jobTitle || "",
    //         jobDescription: jobDetails || jobDescription || "",
    //         jobImage: jobImage || "",
    //         updatedDate: new Date()
    //     }).then((doc) => {
    //         setMsg("")
    //         dispatch(actions.setLoader(false));
    //         console.log("success")
    //     }).catch(error => {
    //         dispatch(actions.setLoader(false));
    //         console.log("error")
    //     });
    // }

    const handleImageSend = (e) => {
        const file = e.target && e.target.files && e.target.files[0]
        if(file){
            dispatch(actions.setLoader(true));
            fireStore.uploadFile('/image', file).then((data) => {
                data.uploadTaskSnapshot.ref.getDownloadURL().then(function (downloadURL) {
                    sendMsg(downloadURL)
                });
            })
        }
    }

    // const sendOffer = () => {
    //     if (offerAmount) {
    //         dispatch(actions.setLoader(true));
    //         firebase.collection("tblOffer").add({
    //             companyId: sendBy,
    //             userId: activeUser.userId,
    //             createdAt: new Date(),
    //             offerAmount: offerAmount,
    //             isAdditionalOffer: !!(jobDetails && jobDetails.length),
    //             projectId: activeUser.projectId,
    //             details: jobDetails || "",
    //             projectStatus: [],
    //             isReadNotification: false,
    //             isNewOffer: true,
    //             isUserAccepted: false,
    //             isCompanyConform: false,
    //             isCompanyCompleted: false,
    //             isUserCompleted: false,
    //             isPaid: false,
    //         }).then(docRef => {
    //             setJobDetails("")
    //             setOfferAmount("")
    //             firebase.collection("tblNotification").add({
    //                 companyId: sendBy,
    //                 userId: activeUser.userId,
    //                 createdAt: new Date(),
    //                 projectId: activeUser.projectId,
    //                 notificationType: "new",
    //                 isRead: false,
    //                 isDeleted: false,
    //                 notificationMessage: `${activeUser.userName} send you new offer`
    //             })
    //             sendMsgWithOffer(docRef && docRef.id)
    //             setJobPost(false)
    //         }).catch((error) => {
    //             dispatch(actions.setLoader(false));
    //         });
    //     }
    // }

    // const sendConfirm = (isOffer) => {
    //     if (isOffer && isOffer.id) {
    //         dispatch(actions.setLoader(true));
    //         firebase.collection("tblOffer").doc(isOffer.id).set({
    //             ...isOffer,
    //             isCompanyConform: true,
    //             isReadNotification: false
    //         }).then(docRef => {
    //             const findCurrentNotification = (notificationList || []).find((x) => x.companyId === isOffer.companyId && x.userId === isOffer.userId && x.projectId === isOffer.projectId && x.notificationType === "userAccepted" && x.isRead === false)
    //             firebase.collection("tblNotification").add({
    //                 companyId: sendBy,
    //                 userId: activeUser.userId,
    //                 createdAt: new Date(),
    //                 projectId: activeUser.projectId,
    //                 notificationType: "companyConform",
    //                 isRead: false,
    //                 isDeleted: false,
    //                 notificationMessage: `${activeUser.userName} conform your offer`
    //             }).then((res) => {
    //                 if (findCurrentNotification && findCurrentNotification.id) {
    //                     firebase.collection("tblNotification").doc(findCurrentNotification.id).set({
    //                         ...findCurrentNotification,
    //                         isRead: true
    //                     })
    //                 }
    //             }).catch(error => {
    //                 console.log("error")
    //             });
    //             dispatch(actions.setLoader(false));
    //         }).catch((error) => {
    //             dispatch(actions.setLoader(false));
    //         });
    //     }
    // }

    // const finishedWork = (isOffer) => {
    //     if (isOffer && isOffer.id) {
    //         dispatch(actions.setLoader(true));
    //         firebase.collection("tblOffer").doc(isOffer.id).set({
    //             ...isOffer,
    //             isCompanyCompleted: true,
    //             isReadNotification: false
    //         }).then(docRef => {
    //             const findCurrentNotification = (notificationList || []).find((x) => x.companyId === isOffer.companyId && x.userId === isOffer.userId && x.projectId === isOffer.projectId && x.notificationType === "userAccepted" && x.isRead === false)
    //             firebase.collection("tblNotification").add({
    //                 companyId: sendBy,
    //                 userId: activeUser.userId,
    //                 createdAt: new Date(),
    //                 projectId: activeUser.projectId,
    //                 notificationType: "CompanyCompleted",
    //                 isRead: false,
    //                 isDeleted: false,
    //                 notificationMessage: `${activeUser.userName} completed your offer`
    //             }).then((res) => {
    //                 if (findCurrentNotification && findCurrentNotification.id) {
    //                     firebase.collection("tblNotification").doc(findCurrentNotification.id).set({
    //                         ...findCurrentNotification,
    //                         isRead: true
    //                     })
    //                 }
    //             }).catch(error => {
    //                 console.log("error")
    //             });
    //             dispatch(actions.setLoader(false));
    //         }).catch((error) => {
    //             dispatch(actions.setLoader(false));
    //         });
    //     }
    // }

    // const activeChat = dataList[active]

    // const isNewOffer = chatsList.filter(p => p.offerId)

    const scroll = () => {
        setTimeout(() => {
            var div = document.getElementById("scroll");
            if (div && div.scrollHeight) {
                div.scrollTop = div.scrollHeight;
            }
        }, 0.00)
    }

    const onChetUser = (record, index) => {
        setActive(index);
        history.push(`/company/company-offers?userId=${record.userId}&projectId=${record.projectId}`);
        const filterData = chatsDetails.filter(k => k.companyId === sendBy)
        const dataItem = filterData.map(l => {
            const user = userDetails.find(k => k.id === l.userId)
            if (user && user.Email) {
                return ({
                    ...l,
                    userName: user.FullName || (user.Email && user.Email.split("@")[0]),
                    profileImage: user.ProfileImage || null
                })
            }
        }).filter((x) => x)
        const urlParams = new URLSearchParams(props.location.search);
        const userId = urlParams.get('userId');
        const projectId = urlParams.get('projectId');
        let findIndex = dataItem.findIndex((k) => k.userId === userId && k.projectId === projectId)
        if(findIndex !== -1){
            readMsg(findIndex, dataItem)
        }
    }

    const backUser = () => {
        $(".chat-main-wrapper").removeClass('d-none');
    }

    $(window).resize(function () {
        var widthWindow = $(window).width();
        if (widthWindow <= '767') {
            $('#chat-user-box').addClass('w-100');
            $('#user-click').addClass('d-none');
            $("#chat-active-user").removeClass('d-none');
            $(".chat-main-wrapper").on('click', function (event) {
                if (window.innerWidth <= 767) {
                    $(".chat-main-wrapper").addClass('d-none');
                    $('.chat-profile-view').addClass('d-none');
                }
            });
        } else {
            $('#chat-user-box').removeClass('w-100');
            $('#user-click').removeClass('d-none');
            $(".chat-main-wrapper").removeClass('d-none');
            $("#chat-active-user").addClass('d-none');
            $('.chat-profile-view').removeClass('d-none');
        }
    });

    const handleModal = (img) => {
        if (Array.isArray(img)) {
            setImages(img)
            setOpenModal(true)
        } else {
            setImages([])
            setOpenModal(false)
        }
    }

    const handleProfileModal = () =>{
        setProfileModal(!isProfileModalOpen)
    }

    const onChange = (e) => {
        setMsg(e.target.value)
    }

    const activeChatUser = (dataList && dataList[active]) || {}

    // const offerData = offerList.filter(l => l.companyId === sendBy).filter(p => p.projectId === projectId)
    // const isOfferPaid = offerData.filter(p => p.isPaid === false)
    const selectedUser = userDetails.find(k => k.id === activeChatUser.userId)
    const projectDetails = (projectMaster || []).find(l => l.id === (activeUser && activeUser.projectId))
    return (
        <div id="wrapper">
            <Dashboardheader />
            <CompanySideBar />
            {isProfileModalOpen &&
                <ProfileView
                    isOpenModal={isProfileModalOpen}
                    profileDetails={selectedUser}
                    projectDetails={projectDetails}
                    closeModal={handleProfileModal}/>}
           {/* {isOpenModal && <ModalsSlider isOpenModal={isOpenModal} handleModal={handleModal} imageList={imageList} />}*/}
            <div className="chatwapper">
                <div className="chat-main-wrapper" id="chat-user-box">
                    {
                        dataList.length > 0 ?
                            dataList.map((item, ind) => {
                                // const chatsList = (dataList[ind] && dataList[ind].chat) || []
                                // const offIds = chatsList.filter(p => p.offerId).map(k => k.offerId)
                                // let totalAmt = 0
                                // if ((offIds && offIds.length) > 0) {
                                //     let allItem = []
                                //     if (offerList && offerList.length && offIds && offIds.length) {
                                //         offIds.forEach(t => {
                                //             allItem.push(offerList.find(p => t === p.id))
                                //         })
                                //         if (allItem && allItem.length) {
                                //             const allData = allItem.map(l => Number(l.offerAmount))
                                //             if (allData.length > 0) {
                                //                 totalAmt = allData.reduce(function (a, b) {
                                //                     return a + b;
                                //                 }, 0);
                                //             }
                                //         }
                                //     }
                                // }
                                const time = (item && item.updatedDate && item.updatedDate.seconds) || ""
                                const date = time ? moment(new Date((time) * 1000)).fromNow(true) : ""
                                // const activeUserOffer = offerList.filter(l => (l.userId === item.userId) && (l.projectId === item.projectId))
                                // let isUserAccepted = false
                                // if (activeUserOffer.length > 0) {
                                //     isUserAccepted = activeUserOffer[activeUserOffer.length - 1].isUserAccepted
                                // }
                                return (
                                    <div key={ind} id="active-chat-user" className={`chat-side-box chatbox-body ${active === ind  ? 'active' : ''}`} onClick={() => onChetUser(item, ind)}>
                                        <a className="chat-img">
                                            <img src={item.jobImage || images.privatelogo} alt="img" />
                                        </a>
                                        <div className="chat-box-body">
                                            <h5>{item.userName}</h5>
                                            <h5>{item.jobTitle}</h5>
                                            <h6>{/*{isUserAccepted && 'ACCEPTED'}*/}<span>{date}</span></h6>
                                        </div>
                                        {/*<div className="salary">
                                            <span>New</span>
                                            <a>${totalAmt}</a>
                                        </div>*/}
                                    </div>
                                )
                            }) : "Inga aktiva uppdrag"
                    }
                </div>
                <div className="chat-main-box" id="chat-msg-box">
                    {
                        (selectedUser && selectedUser.Email) &&
                        <div className="chat-profile-view">
                            <img src={(selectedUser && selectedUser.ProfileImage) || images.avatarImg} alt={selectedUser && selectedUser.userName}/>
                            <p>{selectedUser && selectedUser.FullName}</p>
                            <button className="greenfill-btnbox" onClick={handleProfileModal}>Se uppdraget</button>
                        </div>
                    }
                    <div id="chat-active-user" className="chat-active-user">
                        <button id="back-btn" className="back-btn" onClick={() => backUser()}><i className="fas fa-arrow-left" /></button>
                        {
                            (selectedUser && selectedUser.Email) &&
                            <div className="res-user-img">
                                <img src={(selectedUser && selectedUser.ProfileImage) || images.avatarImg} alt={selectedUser && selectedUser.userName}/>
                            </div>
                        }
                        <div className="chat-active-user-name">
                            <p>{activeChatUser && activeChatUser.userName}</p>
                            <p>{activeChatUser && activeChatUser.jobTitle}</p>
                        </div>
                        <button className="greenfill-btnbox" onClick={handleProfileModal}>Se uppdraget</button>
                    </div>
                    <div className="chat-inner-wrap" id={"scroll"}>
                        <div className="chat-inner">
                            {
                                // eslint-disable-next-line array-callback-return
                                chatsList.map((obj, i) => {
                                    // const isOffer = offerList.find(p => p.id === obj.offerId)
                                    // const amt = offerList.filter(p => p.id === obj.offerId)
                                    // if (amt.length) {
                                    //     const allData = amt.map(l => Number(l.offerAmount))
                                    // }
                                    if ((chatsList && chatsList.length) === (i + 1)) {
                                        scroll()
                                    }
                                    if (obj.message) {
                                        const date = new Date(obj.messageDate.seconds * 1000)
                                        const time = moment(date).format('hh:mm A')
                                        const isImage = obj.message.includes("googleapis")
                                        return (
                                            <div key={i} className={`row m-b-0 ${sendBy === obj.sendBy ? "send-chat" : "received-chat"}`}>
                                                <div className="col">
                                                    <div className={`m-b-20 ${!isImage ? 'msg' : ''}`}>
                                                        <div className={`${!isImage ? '' : 'chatimg'}`}>
                                                            {
                                                                isImage ? <img src={obj.message} alt="img" onClick={() => handleModal([obj.message])} /> : <p>{obj.message}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <p className="timetext">{time}</p>
                                                </div>
                                            </div>
                                        )
                                    }

                                    // if (isOffer && isOffer.id) {
                                    //     const offerDate = new Date((isOffer.createdAt && isOffer.createdAt.seconds) * 1000)
                                    //     const offerTime = moment(offerDate).format('hh:mm A')
                                    //     const details = dataList[active]
                                    //     if (isOffer.isCompanyConform && isOffer.isUserAccepted && !isOffer.isCompanyCompleted) {
                                    //         const sendToUser = userDetails.find(l => l.id === obj.sendTo)
                                    //         const sendByUser = userDetails.find(l => l.id === obj.sendBy)
                                    //         return (
                                    //             <ConfirmedOffer
                                    //                 key={i}
                                    //                 isShowFinishedBtn={true}
                                    //                 sendToUser={sendToUser}
                                    //                 sendByUser={sendByUser}
                                    //                 isCompanyCompleted={isOffer.isCompanyCompleted}
                                    //                 finishedWork={() => finishedWork(isOffer)}
                                    //                 isOffer={isOffer} />)
                                    //     } else if ((isOffer && isOffer.isUserAccepted) && !(isOffer.isCompanyCompleted)) {
                                    //         const sendToUser = userDetails.find(l => l.id === obj.sendTo)
                                    //         const sendByUser = userDetails.find(l => l.id === obj.sendBy)
                                    //         return (
                                    //             <div key={i} className="accepted-box-bg m-b-0 offer-sticky">
                                    //                 <div className="accepted-box-body offer_conform">
                                    //                     <div className="right-img">
                                    //                         <img src={sendToUser.ProfileImage || images.avatarImg} />
                                    //                         <h5>{sendToUser.FullName}</h5>
                                    //                     </div>
                                    //                     <div className="line-wrapper">
                                    //                         <a>${isOffer.offerAmount}</a>
                                    //                     </div>
                                    //                     <div className="right-img left-img">
                                    //                         <img src={sendByUser.ProfileImage || images.avatarImg} />
                                    //                         <h5>{sendByUser.FullName}</h5>
                                    //                     </div>
                                    //                 </div>
                                    //                 <div className="bottom-two-btn">
                                    //                     <a className="bottom-two-box">
                                    //                         Accepted <i className="fa fa-check" aria-hidden="true" />
                                    //                     </a>
                                    //                     <a onClick={() => sendConfirm(isOffer)}>Confirm</a>
                                    //                 </div>
                                    //             </div>
                                    //         )
                                    //     } else if (isOffer && isOffer.isCompanyCompleted && !isOffer.isUserCompleted) {
                                    //         return (
                                    //             <div key={i} className="offerbox-main">
                                    //                 <div className="offerbox-main-wrapper-box">
                                    //                     <a className="chat-img">
                                    //                         {details.jobImage && <img src={details.jobImage} />}
                                    //                     </a>
                                    //                     <div className="offer-body-wrapper">
                                    //                         <h5>Work is Finished</h5>
                                    //                         <h4>{offerTime}</h4>
                                    //                     </div>
                                    //                 </div>
                                    //                 <div className="offer-price">
                                    //                     <a>${isOffer.offerAmount}</a>
                                    //                 </div>
                                    //                 <div className="offer-message">
                                    //                     <h6>Confirmation Awaits!</h6>
                                    //                 </div>
                                    //             </div>)
                                    //     } else if (isOffer.isUserCompleted) {
                                    //         const sendToUser = userDetails.find(l => l.id === obj.sendTo)
                                    //         const sendByUser = userDetails.find(l => l.id === obj.sendBy)
                                    //         return (
                                    //             <div key={i}>
                                    //                 <div className="accepted-box-bg greeb-box m-b-0">
                                    //                     <div className="accepted-box-body offer_conform">
                                    //                         <div className="right-img">
                                    //                             <img src={sendToUser.ProfileImage || images.avatarImg} />
                                    //                             <h5>{sendToUser.FullName}</h5>
                                    //                         </div>
                                    //                         <div className="green-bg-line">
                                    //                             <a>${isOffer.offerAmount}</a>
                                    //                         </div>
                                    //                         <div className="right-img left-img">
                                    //                             <img src={sendByUser.ProfileImage || images.avatarImg} />
                                    //                             <h5>{sendByUser.FullName}</h5>
                                    //                         </div>
                                    //                     </div>
                                    //                     <div className="bottom-two-btn green-bottom-box">
                                    //                         <a className="bottom-two-box">Accepted <i className="fa fa-check" aria-hidden="true" /></a>
                                    //                         <a className="bottom-two-box">Confirm <i className="fa fa-check" aria-hidden="true" /></a>
                                    //                     </div>
                                    //                     <div className="congrats-msg congrats-green-msg">
                                    //                         <div className="congrats-msg-box">
                                    //                             <div className="check-icon">
                                    //                                 <img src={images.congratsiconwhite} alt="img" />
                                    //                             </div>
                                    //                             <div className="congrats-msg-script">
                                    //                                 <p>Congratulations, Work is finished! <br /> You’ve received the payment now rate the consumer. </p>
                                    //                             </div>
                                    //                         </div>
                                    //                     </div>
                                    //                 </div>
                                    //                 {isOffer.isPaid &&
                                    //                     <React.Fragment>
                                    //                         <div className="offerbox-main">
                                    //                             <div className="offerbox-main-wrapper-box">
                                    //                                 <a className="chat-img">
                                    //                                     <img src={sendToUser.ProfileImage || images.avatarImg} />
                                    //                                 </a>
                                    //                                 <div className="offer-body-wrapper">
                                    //                                     <h5>Work is Finished</h5>
                                    //                                     <h4>{offerTime}</h4>
                                    //                                 </div>
                                    //                             </div>
                                    //                             <div className="offer-price">
                                    //                                 <a>${isOffer.offerAmount}</a>
                                    //                             </div>
                                    //                             <div className="green-confirm-box">
                                    //                                 <a>Confirmed <i className="fa fa-check" aria-hidden="true" /></a>
                                    //                             </div>
                                    //                         </div>
                                    //                         <div className="offerbox-main">
                                    //                             <div className="offerbox-main-wrapper-box">
                                    //                                 <div className="offer-body-wrapper">
                                    //                                     <h5>Payment Recieved</h5>
                                    //                                     <h4>{offerTime}</h4>
                                    //                                 </div>
                                    //                             </div>
                                    //                             <div className="offer-price">
                                    //                                 <a>${isOffer.offerAmount}</a>
                                    //                             </div>
                                    //                             <div className="offer-message">
                                    //                                 <a onClick={() => setIsRate(true)}>Rate the consumer</a>
                                    //                             </div>
                                    //                         </div>
                                    //                     </React.Fragment>
                                    //                 }
                                    //                 {isOffer.isPaid && isRate && <CompanyOffersRate close={() => setIsRate(false)} projectId={projectId} companyId={companyId} />}
                                    //             </div>
                                    //         )
                                    //     } else if (isOffer.isNewOffer) {
                                    //         return (
                                    //             <div key={i} className="chat-side-box chatbox-bg chat-line m-b-0 offer-sticky">
                                    //                 <a className="chat-img">
                                    //                     {activeChat.jobImage && <img src={activeChat.jobImage} />}
                                    //                 </a>
                                    //                 <div className="chat-box-body chatbox_main_offer">
                                    //                     <div className="chatbox_offer">
                                    //                         <h5>New Offer</h5>
                                    //                         <p>{isOffer.details}</p>
                                    //                         <h4>{offerTime}</h4>
                                    //                     </div>
                                    //                     <div className="salary salary-right">
                                    //                         <a>${isOffer.offerAmount}</a>
                                    //                         {isOffer.isUserRejected && <p>Your offer has been rejected</p>}
                                    //                     </div>
                                    //                 </div>
                                    //             </div>)
                                    //     } else {
                                    //         return (
                                    //             <div key={i} className="chat-side-box chatbox-bg chat-line m-b-0 offer-sticky">
                                    //                 <a className="chat-img">
                                    //                     {activeChat.jobImage && <img src={activeChat.jobImage} />}
                                    //                 </a>
                                    //                 <div className="chat-box-body chatbox_main_offer">
                                    //                     <div className="chatbox_offer">
                                    //                         <h5>New Offer</h5>
                                    //                         <p>{activeChat.details || activeChat.jobTitle || ""}</p>
                                    //                         <h4>{offerTime}</h4>
                                    //                     </div>
                                    //                     <div className="salary salary-right">
                                    //                         <a>${isOffer.offerAmount}</a>
                                    //                     </div>
                                    //                 </div>
                                    //             </div>)
                                    //     }
                                    // }
                                })
                            }
                        </div>
                        {/*<CompanyOffersRate projectId={projectId} companyId={companyId}/>*/}
                    </div>
                    {/*<div className={`sendoffer-box ${(activeChatUser && activeChatUser.projectId === projectId && activeChatUser && activeChatUser.userId === userId && jobPost) || jobPost ? 'open' : ''} ${isNewOffer.length > 0 ? 'additionaloffer' : ''}`}>*/}
                    {/*    <div className="send-offer">*/}
                    {/*        <div className="send-inner-box">*/}
                    {/*            <h5>Send<br />New Offer</h5>*/}
                    {/*            <div className="offerbox">*/}
                    {/*                <input type="number" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder="Amount" />*/}
                    {/*            </div>*/}
                    {/*            <div className="send-btn">*/}
                    {/*                <a onClick={sendOffer}>Send</a>*/}
                    {/*            </div>*/}
                    {/*            <a className="close-btn" onClick={() => setJobPost(false)}><i className="fas fa-times" /></a>*/}
                    {/*        </div>*/}
                    {/*        {*/}
                    {/*            isNewOffer.length > 0 &&*/}
                    {/*            <textarea placeholder="Details" value={jobDetails} onChange={(e) => setJobDetails(e.target.value)} />*/}
                    {/*        }*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {
                        dataList.length > 0 ? <div className="sendchat-box">
                            <div className="dolarbox senddolar-box">
                                {/*{*/}
                                {/*    isOfferPaid.length ?*/}
                                {/*        <a className="dolarbox-img"><img src={images.dolaricon} alt="img" /></a> :*/}
                                {/*        <a className="dolarbox-img sendbox" onClick={() => setJobPost(true)}><img src={images.dolaricon} alt="img" /></a>*/}
                                {/*}*/}
                                <div className="lingicon ml-0">
                                    <div className="file-wrapper">
                                        <input type="file" className="upload_btn" onChange={handleImageSend} />
                                        <i className="fas fa-paperclip clipicon" />
                                    </div>
                                    <input className="message-box"
                                        value={message}
                                        onChange={onChange}
                                        onKeyPress={keyPressed}
                                        type="text" placeholder="Skriv ditt meddelande här..." />
                                    <a><i className="fas fa-paper-plane papericon" onClick={() => sendMsg()} /></a>
                                </div>
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        </div>
    );
}

export default compose(
    withFirestore,
    connect((state) => ({
        chatsDetails: (state.firestore.ordered && state.firestore.ordered.chatsDetails) || [],
        userDetails: (state.firestore.ordered && state.firestore.ordered.userDetails) || [],
        // offerList: (state.firestore.ordered && state.firestore.ordered.offerList) || [],
        notificationList: (state.firestore.ordered && state.firestore.ordered.notificationList) || [],
        projectMaster: (state.firestore.ordered && state.firestore.ordered.projectMaster) || [],
    }))
)(CompanyOffers)