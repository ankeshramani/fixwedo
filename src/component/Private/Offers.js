import React, { useState } from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import Dashboardsidebar from '../Layout/DashboardSideBar';
import images from "../../utils/ImageHelper";
import { compose } from "redux";
import { useFirebase, useFirestore, withFirestore } from "react-redux-firebase";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import * as actions from "../../redux/action/actions";
import OffersRate from "./OffersRate";
import ConfirmedOffer from "../Company/Offers/ConfirmedOffer";
import OffersPayment from "./Component/OffersPayment";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { toast } from "react-toastify";
import ModalsSlider from "../CommonComponents/ModalsSlider";
import ProfileView from "../CommonComponents/ProfileView";
const Offers = ({ chatsDetails, userDetails, offerList, notificationList, projectMaster, ...props }) => {

    let history = useHistory();
    const firebase = useFirestore();
    const fireStore = useFirebase();
    const dispatch = useDispatch();
    const [dataList, setData] = useState([]);
    const [active, setActive] = useState(0);
    const [message, setMsg] = useState("");
    const [userIdMessage, setUserIdMessage] = useState("");
    const [projectIdMessage, setProjectIdMessage] = useState("");
    const [imageList, setImages] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isProfileModalOpen, setProfileModal] = useState(false);

    const chatsList = (dataList[active] && dataList[active].chat) || []
    const activeUser = dataList[active]
    const sendBy = localStorage.getItem('userId')
    const urlParams = new URLSearchParams(props.location.search);
    const projectId = urlParams.get('projectId') || (activeUser && activeUser.projectId);
    const companyId = urlParams.get('companyId') || (activeUser && activeUser.companyId);
    const notificationIdPrivate = localStorage.getItem("notificationIdPrivate") || ""
    const activeChatUser = (dataList && dataList[active]) || {}

    const isChatActive = projectMaster.find(p => p.id === activeChatUser.projectId)
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
            {
                collection: 'tblProjectMaster',
                storeAs: 'projectMaster'
            },
        ])

        dispatch(actions.setLoader(true));
    }, [firebase])

    React.useEffect(() => {

        if(props && props.history && props.history.location && props.history.location.state){
            const data = props.history.location.state
            const filterData = chatsDetails.filter(k => k.userId === sendBy)
            const dataItem = filterData.map(l => {
                const user = userDetails.find(k => k.id === l.companyId)
                if (user && user.Email) {
                    return ({
                        ...l,
                        userName: user.FullName || (user.Email && user.Email.split("@")[0]),
                        profileImage: user.ProfileImage || null
                    })
                }
            }).filter((x) => x)
            let findIndex = dataItem.findIndex((k) => k.companyId === data.companyId && k.projectId === data.projectId)
            if (findIndex !== -1) {
                setActive(findIndex)
                // eslint-disable-next-line no-mixed-operators
                if (((findIndex !== active) &&  data.companyId) || findIndex === 0 &&  data.companyId) {
                    readMsg(findIndex, dataItem)
                }
            }
        }
    }, [props && props.history && props.history.location && props.history.location.state])

    React.useEffect(() => {
        const record = notificationList.find((x) => x.id === notificationIdPrivate) || {}
        if (record && record.id) {
            firebase.collection("tblNotification").doc(record.id).set({
                ...record,
                isRead: true
            }).then((doc) => {
                localStorage.removeItem("notificationIdPrivate")
            }).catch(error => {
                toast.error("Something went wrong please try again");
            });
        }
    }, [notificationIdPrivate])


    React.useEffect(() => {
        if ((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)) {
            const dataList = chatsDetails.filter(p => p.userId === sendBy)
            const dataItem = dataList.map(l => {
                const user = userDetails.find(k => k.id === l.companyId)
                if (user && user.Email) {
                    return ({
                        ...l,
                        userName: user.FullName || (user.Email && user.Email.split("@")[0]),
                        profileImage: user.ProfileImage || null
                    })
                }
            }).filter((x) => x)
            if (props.location && props.location.search) {
                const urlParams = new URLSearchParams(props.location.search);
                const companyId = urlParams.get('companyId');
                const projectId = urlParams.get('projectId');
                let findIndex = dataItem.findIndex((k) => k.companyId === companyId && k.projectId === projectId)
                if (findIndex !== -1) {
                    setActive(findIndex)
                    // eslint-disable-next-line no-mixed-operators
                    if (((findIndex !== active) && projectId) || findIndex === 0 && projectId) {
                        setUserIdMessage(companyId)
                        setProjectIdMessage(projectId)
                        if (companyId !== userIdMessage && projectId !== projectIdMessage) {
                            readMsg(findIndex, dataItem)
                        }
                    }
                }
            }
            setData(dataItem.sort((a, b) => (b.updatedDate) - (a.updatedDate)))
            if(dataList && dataList.length > 0){
                if(companyId !== dataList[0].companyId || projectId !== dataList[0].projectId){
                    setActive(0);
                    history.push(`/offers?companyId=${dataList[0].companyId}&projectId=${dataList[0].projectId}`);
                }
            }
            dispatch(actions.setLoader(false));
        } else {
            dispatch(actions.setLoader(false));

        }
    }, [chatsDetails, userDetails, notificationList])

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
        if (target.charCode === 13) {
            sendMsg()
        }
    }

    const readMsg = (activeSet, dataItem) => {
        const activeChat = dataItem[activeSet]
        if(activeChat.chat.filter(p => !p.isRead).length > 0){
            const { projectId, userName, userId, createdAt, companyId, id, jobTitle, jobDescription, jobImage } = activeChat
            if (activeChat && activeChat.chat && activeChat.chat.length) {
                const readData = activeChat.chat.map(item => ({
                    ...item,
                    isRead: true
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
                message: downloadURL || message,
                sendBy: sendBy,
                sendTo: companyId,
                isRead: false,
                isReadCompany: false,
                messageId: messageId
            }
            clone.push(obj)
            // dispatch(actions.setLoader(true));
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
            }).then(async (doc) => {
                const user = userDetails.find(k => k.id === companyId)
                const loginUserDetails = userDetails.find(k => k.id === sendBy)
                if (user && user.IsLogin === false) {
                    sendMail(user, loginUserDetails, jobTitle, tempMessage, userId, projectId)
                }
                console.log("success")
            }).catch(error => {
                setMsg("")
                // dispatch(actions.setLoader(false));
                console.log("error")
            });
        }
    }
    const sendMail = async (user, loginUserDetails, jobTitle, tempMessage, userId, projectId) => {
        let response = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${user.Email}&emailName=chat&docId=""&projectTitle=${jobTitle}&name=${loginUserDetails.FullName || loginUserDetails.UserName}&message=${tempMessage}&messageLink=${window.location.origin}/company/company-offers?userId=${userId}&projectId=${projectId}`, {
            method: "GET",
        });
        response.json().then((res) => {
            console.log("res", res)
        }).catch((e) => {
            console.log("e", e)
        })
    }

    const handleImageSend = (e) => {
        const file = (e.target && e.target.files && e.target.files[0])
        if(file){
            fireStore.uploadFile('/image', file).then((data) => {
                data.uploadTaskSnapshot.ref.getDownloadURL().then(function (downloadURL) {
                    sendMsg(downloadURL)
                });
            })
        }
    }

    // const acceptOfferPrivate = (info) => {
    //     firebase.collection("tblOffer").doc(info.id).set({
    //         ...info,
    //         isUserAccepted: true,
    //         isNewOffer: false,
    //         isReadNotification: false
    //     }).then((doc) => {
    //         const findCurrentNotification = (notificationList || []).find((x) => x.companyId === info.companyId && x.userId === info.userId && x.projectId === info.projectId && x.notificationType === "new" && x.isRead === false)
    //         // const findCurrentNotificationCompanyConform = (notificationList || []).find((x) => x.companyId === info.companyId && x.userId === info.userId && x.projectId === info.projectId && x.notificationType === "companyConform" && x.isRead === false)
    //         firebase.collection("tblNotification").add({
    //             companyId: info.companyId,
    //             userId: sendBy,
    //             createdAt: new Date(),
    //             projectId: info.projectId,
    //             notificationType: "userAccepted",
    //             isRead: false,
    //             isDeleted: false,
    //             notificationMessage: `${activeUser.userName} accepted your offer`
    //         }).then((res) => {
    //             if (findCurrentNotification && findCurrentNotification.id) {
    //                 firebase.collection("tblNotification").doc(findCurrentNotification.id).set({
    //                     ...findCurrentNotification,
    //                     isRead: true
    //                 })
    //             } /*else {
    //                 if (findCurrentNotificationCompanyConform && findCurrentNotificationCompanyConform.id) {
    //                     firebase.collection("tblNotification").doc(findCurrentNotificationCompanyConform.id).set({
    //                         ...findCurrentNotificationCompanyConform,
    //                         isRead: true
    //                     })
    //                 }
    //             }*/
    //         }).catch(error => {
    //             console.log("error")
    //         });
    //         dispatch(actions.setLoader(false));
    //         console.log("success")
    //     }).catch(error => {
    //         dispatch(actions.setLoader(false));
    //         console.log("error")
    //     });
    // }

    // const rejectOfferPrivate = (info) => {
    //     firebase.collection("tblOffer").doc(info.id).set({
    //         ...info,
    //         isUserRejected: true,
    //         isReadNotification: false,
    //         isPaid: true
    //     }).then((doc) => {
    //         const findCurrentNotification = (notificationList || []).find((x) => x.companyId === info.companyId && x.userId === info.userId && x.projectId === info.projectId && x.notificationType === "CompanyCompleted" && x.isRead === false)
    //         firebase.collection("tblNotification").add({
    //             companyId: info.companyId,
    //             userId: sendBy,
    //             createdAt: new Date(),
    //             projectId: info.projectId,
    //             notificationType: "offerRejected",
    //             isRead: false,
    //             isDeleted: false,
    //             notificationMessage: `${activeUser.userName} reject your offer`
    //         }).then((res) => {
    //             if (findCurrentNotification && findCurrentNotification.id) {
    //                 firebase.collection("tblNotification").doc(findCurrentNotification.id).set({
    //                     ...findCurrentNotification,
    //                     isRead: true
    //                 })
    //             }
    //         }).catch(error => {
    //             console.log("error")
    //         });
    //     }).catch(error => {
    //         console.log("error")
    //     });
    // }

    // const userConfirm = (info) => {
    //     firebase.collection("tblOffer").doc(info.id).set({
    //         ...info,
    //         isUserAccepted: true,
    //         isUserCompleted: true,
    //     }).then((doc) => {
    //         const findCurrentNotification = (notificationList || []).find((x) => x.companyId === info.companyId && x.userId === info.userId && x.projectId === info.projectId && x.notificationType === "CompanyCompleted" && x.isRead === false)
    //         firebase.collection("tblNotification").add({
    //             companyId: info.companyId,
    //             userId: sendBy,
    //             createdAt: new Date(),
    //             projectId: info.projectId,
    //             notificationType: "userCompleted",
    //             isRead: false,
    //             isDeleted: false,
    //             notificationMessage: `${activeUser.userName} completed your offer`
    //         }).then((res) => {
    //             if (findCurrentNotification && findCurrentNotification.id) {
    //                 firebase.collection("tblNotification").doc(findCurrentNotification.id).set({
    //                     ...findCurrentNotification,
    //                     isRead: true
    //                 })
    //             }
    //         }).catch(error => {
    //             console.log("error")
    //         });
    //         dispatch(actions.setLoader(false));
    //         console.log("success")
    //     }).catch(error => {
    //         dispatch(actions.setLoader(false));
    //         console.log("error")
    //     });
    // }

    // const makePayment = (info) => {
    //     dispatch(actions.setLoader(true));
    //     firebase.collection("tblOffer").doc(info.id).set({
    //         ...info,
    //         isPaid: true
    //     }).then((doc) => {
    //         firebase.collection("tblNotification").add({
    //             companyId: info.companyId,
    //             userId: sendBy,
    //             createdAt: new Date(),
    //             projectId: info.projectId,
    //             notificationType: "paymentComplete",
    //             isRead: false,
    //             isDeleted: false,
    //             notificationMessage: `${activeUser.userName} complete your offer payment`
    //         })
    //         firebase.collection("tblPaidPaymentInfo").add({
    //             companyId: info.companyId,
    //             userId: sendBy,
    //             projectId: info.projectId,
    //             amount: info.offerAmount,
    //             createdDate: new Date(),
    //             offerId: info.id
    //         })
    //         dispatch(actions.setLoader(false));
    //         toast.success("Payment Successfully")
    //     }).catch(error => {
    //         dispatch(actions.setLoader(false));
    //         toast.error("Something went wrong please try again")
    //     });
    // }

    const scroll = () => {
        setTimeout(() => {
            var div = document.getElementById("scroll");
            if (div && div.scrollHeight) {
                div.scrollTop = div.scrollHeight;
            }
        }, 0.00)
    }

    const onChetUser = (record, index) => {
        setActive(index)
        history.push(`/offers?companyId=${record.companyId}&projectId=${record.projectId}`);
        const urlParams = new URLSearchParams(props.location.search);
        const companyId = urlParams.get('companyId');
        const projectId = urlParams.get('projectId');
        const dataList = chatsDetails.filter(p => p.userId === sendBy)
        const dataItem = dataList.map(l => {
            const user = userDetails.find(k => k.id === l.companyId)
            if (user && user.Email) {
                return ({
                    ...l,
                    userName: user.FullName || (user.Email && user.Email.split("@")[0]),
                    profileImage: user.ProfileImage || null
                })
            }
        }).filter((x) => x)
        let findIndex = dataItem.findIndex((k) => k.companyId === companyId && k.projectId === projectId)
        if(findIndex !== -1){
            readMsg(findIndex, dataItem)
        }
    }

    const unlockJob = () =>{
        const selectedUser = userDetails.find(k => k.id === activeChatUser.companyId)
        firebase.collection("tblProjectMaster").doc(isChatActive.id).set({
            ...isChatActive,
            isProjectLocked: false
        }).then((doc) => {
            firebase.collection("tblNotification").add({
                companyId: selectedUser.id,
                userId: sendBy,
                createdAt: new Date(),
                projectId: isChatActive.id,
                notificationType: "cancelChat",
                isRead: false,
                isDeleted: false,
                notificationMessage: `${isChatActive.Title}  cancel offer from ${isChatActive.nameOfUser}`
            }).then((res) => {
            }).catch((e) => {
            })
            console.log("success")
        }).catch(error => {
            console.log("error")
        });
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
    const selectedUser = userDetails.find(k => k.id === activeChatUser.companyId)
    const projectDetails = (projectMaster || []).find(l => l.id === (activeUser && activeUser.projectId))
    const aa = dataList.sort((a, b) => (b.messageDate) - (a.messageDate))
    return (
        <div id="wrapper">
            <Dashboardheader />
            <Dashboardsidebar />
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
                                //
                                //     if (offerList && offerList.length && offIds && offIds.length) {
                                //         offIds.forEach(t => {
                                //             const isPaid = offerList.find(p => t === p.id && p.isCompanyConform)
                                //             if (isPaid && isPaid.id) {
                                //                 allItem.push(isPaid)
                                //             }
                                //         })
                                //
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

                                // const activeUserOffer = offerList.filter(l => (l.userId === item.userId) && (l.projectId === item.projectId))
                                // let isUserAccepted = false
                                // if (activeUserOffer.length > 0) {
                                //     isUserAccepted = activeUserOffer[activeUserOffer.length - 1].isUserAccepted
                                // }
                                const time = (item && item.updatedDate && item.updatedDate.seconds) || ""
                                const date = time ? moment(new Date((time) * 1000)).fromNow(true) : ""
                                return (
                                    <div key={ind} id="active-chat-user" className={`chat-side-box chatbox-body ${active === ind ? 'active' : ''}`} onClick={() => onChetUser(item, ind)}>
                                        <a className="chat-img">
                                            <img src={item.jobImage || images.privatelogo} alt="img" />
                                        </a>
                                        <div className="chat-box-body">
                                            <h5>{item.userName}</h5>
                                            <h5>{item.jobTitle}</h5>
                                            <h6>{/*{isUserAccepted && 'ACCEPTED'}*/} <span>{date}</span></h6>
                                        </div>
                                       {/* <div className="salary">
                                            <span>New</span>
                                            <a>${totalAmt}</a>
                                        </div>*/}
                                    </div>
                                )
                            }) : "Inga aktiva uppdrag"
                    }

                    {/*<div className="chat-side-box chatbox-body opasity-box">*/}
                    {/*    <a className="chat-img" href="/#">*/}
                    {/*        <img src={images.chat1} alt=""></img>*/}
                    {/*    </a>*/}
                    {/*    <div className="chat-box-body">*/}
                    {/*        <h5>Matthew Scott</h5>*/}
                    {/*        <h4>12 Hours Ago</h4>*/}
                    {/*    </div>*/}
                    {/*	<div className="salary">*/}
                    {/*		<a href="/#">$2000</a>*/}
                    {/*	</div>*/}
                    {/*</div>*/}
                </div>
                <div className="chat-main-box" id="chat-msg-box">
                    {
                        (selectedUser && selectedUser.Email) &&
                        <div className="chat-profile-view">
                            <img style={{maxWidth: 75}} src={(selectedUser && selectedUser.ProfileImage) || images.avatarImg} alt={selectedUser && selectedUser.userName}/>
                            <p>{selectedUser && selectedUser.FullName}</p>
                            <button className="greenfill-btnbox" onClick={handleProfileModal}>Visa detaljer</button>
                        </div>
                    }
                    <div id="chat-active-user" className="chat-active-user">
                        <button id="back-btn" className="back-btn" onClick={() => backUser()}><i className="fas fa-arrow-left" /></button>
                        {
                            (selectedUser && selectedUser.Email) &&
                            <div className="res-user-img">
                                <img style={{maxWidth: 75}} src={(selectedUser && selectedUser.ProfileImage) || images.avatarImg} alt={selectedUser && selectedUser.userName}/>
                            </div>
                        }
                        <div className="chat-active-user-name">
                            <p>{activeChatUser && activeChatUser.userName}</p>
                            <p>{activeChatUser && activeChatUser.jobTitle}</p>
                        </div>
                        <button className="greenfill-btnbox" onClick={handleProfileModal}>Visa detaljer</button>
                    </div>
                    <div className="chat-inner-wrap" id={"scroll"}>

                        <div className="chat-inner">
                            {
                                // eslint-disable-next-line array-callback-return
                                chatsList.map((obj, i) => {
                                    const date = new Date(obj.messageDate.seconds * 1000)
                                    const time = moment(date).format('hh:mm A')
                                    const isImage = obj.message.includes("googleapis")
                                    // const isOffer = offerList.find(p => p.id === obj.offerId)

                                    if ((chatsList && chatsList.length) === (i + 1)) {
                                        scroll()
                                    }
                                    if (obj.message) {
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
                                    //     const details = dataList[active]
                                    //     const offerDate = new Date((isOffer.createdAt && isOffer.createdAt.seconds) * 1000)
                                    //     const offerTime = moment(offerDate).format('hh:mm A')
                                    //     const sendToUser = userDetails.find(l => l.id === obj.sendTo)
                                    //     const sendByUser = userDetails.find(l => l.id === obj.sendBy)
                                    //
                                    //     if (isOffer.isCompanyConform && isOffer.isUserAccepted && !isOffer.isCompanyCompleted) {
                                    //         return (
                                    //             <ConfirmedOffer
                                    //                 key={i}
                                    //                 sendToUser={sendToUser}
                                    //                 sendByUser={sendByUser}
                                    //                 isOffer={isOffer} />)
                                    //     } else if (isOffer.isUserAccepted && !isOffer.isCompanyCompleted) {
                                    //         return (
                                    //             <div className="accepted-box-bg m-b-0" key={i}>
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
                                    //                 <div className="bottom-two-btn private-confirm-msg">
                                    //                     <a className="bottom-two-box mb-0">
                                    //                         Accepted <i className="fa fa-check" aria-hidden="true" />
                                    //                     </a>
                                    //                     <h6>Confirmation Awaits!</h6>
                                    //                 </div>
                                    //             </div>
                                    //         )
                                    //     } else if (isOffer.isCompanyCompleted && !isOffer.isUserCompleted) {
                                    //         return (
                                    //             <div className="offerbox-main chat-line" key={i}>
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
                                    //                     <a className="confirm-btn" onClick={() => userConfirm(isOffer)}>Confirm</a>
                                    //                 </div>
                                    //                 <div className="offer-greenbox">
                                    //                     <p>Worker has marked the job as completed, Please confirm the job has been done!</p>
                                    //                 </div>
                                    //             </div>
                                    //         )
                                    //     } else if (isOffer.isUserCompleted) {
                                    //         return (
                                    //             <OffersPayment
                                    //                 key={i}
                                    //                 sendToUser={sendToUser}
                                    //                 sendByUser={sendByUser}
                                    //                 isOffer={isOffer}
                                    //                 isPaid={isOffer.isPaid}
                                    //                 projectId={projectId}
                                    //                 companyId={companyId}
                                    //                 makePayment={() => makePayment(isOffer)} />)
                                    //     } else {
                                    //         return (
                                    //             <div key={i} className="offerbox-main">
                                    //                 <div className="offerbox-main-wrapper-box">
                                    //                     <a className="chat-img">
                                    //                         {details.jobImage && <img src={details.jobImage} />}
                                    //                     </a>
                                    //                     <div className="chat-box-body">
                                    //                         <h5>{details.jobTitle}</h5>
                                    //                         <h4>{offerTime}</h4>
                                    //                     </div>
                                    //                 </div>
                                    //                 <div className="offer-price">
                                    //                     <a>${isOffer.offerAmount}</a>
                                    //                 </div>
                                    //                 <div className="private-offer-btn">
                                    //                     {
                                    //                         isOffer.isUserRejected &&
                                    //                         <div className="bottom-two-btn private-confirm-msg">
                                    //                             <h6>Rejected!</h6>
                                    //                         </div>
                                    //                     }
                                    //                     {
                                    //                         !isOffer.isUserRejected && <a className="reject-btn" onClick={() => rejectOfferPrivate(isOffer)}>Reject</a>
                                    //                     }
                                    //                     {
                                    //                         !isOffer.isUserRejected && <a onClick={() => acceptOfferPrivate(isOffer)}>Accept</a>
                                    //                     }
                                    //                 </div>
                                    //             </div>)
                                    //     }
                                    // }
                                })
                            }

                        </div>
                    </div>
                    {/*<div className="sendoffer-box">*/}
                    {/*    <div className="send-offer">*/}
                    {/*        <div className="send-inner-box">*/}
                    {/*            <h5>Send New <br /> Offer</h5>*/}
                    {/*            <div className="offerbox">*/}
                    {/*                <input type="number" placeholder="$650" />*/}
                    {/*            </div>*/}
                    {/*            <div className="send-btn">*/}
                    {/*                <a>Send</a>*/}
                    {/*            </div>*/}
                    {/*            <a className="close-btn"><i className="fas fa-times" /></a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {
                        ((dataList && dataList.length) > 0) && <div className="sendchat-box">
                            <div className="dolarbox">
                                {
                                    isChatActive && isChatActive.isProjectLocked &&
                                    <button className="close-chat" onClick={unlockJob}>Återpublicera uppdrag</button>
                                }
                                <div className="lingicon paperclip">
                                    <div className="file-wrapper">
                                        <input type="file" className="upload_btn" onChange={handleImageSend} />
                                        <i className="fas fa-paperclip clipicon" />
                                    </div>
                                    <input className="message-box"
                                        value={message}
                                        onKeyPress={keyPressed}
                                        onChange={(e) => setMsg(e.target.value)}
                                        type="text" placeholder="Skriv ett meddelande…" />
                                    <a><i className="fas fa-paper-plane papericon" onClick={() => sendMsg()} /></a>
                                </div>
                            </div>
                        </div>
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
)(Offers)