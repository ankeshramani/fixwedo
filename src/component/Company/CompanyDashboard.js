import React, { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Dashboardheader from "../Layout/DashboardHeader";
import CompanySideBar from "../Layout/CompanySideBar";
import images from "../../utils/ImageHelper";
import { useFirestore, withFirestore } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import Slider from "react-slick";
import ReadMoreAndLess from "react-read-more-less";
import * as actions from "../../redux/action/actions";
import { toast } from "react-toastify";
import $ from "jquery";
import CompanyMessageController from "../Messagecontroller/CompanyMessageController";
import ModalsSlider from "../CommonComponents/ModalsSlider";
import PaymentModal from "../Payment/PaymentModal";
import {ApiService} from "../../ApiService";

const CompanyDashboard = ({ projectMaster, userDetails, ...props }) => {
    const firebase = useFirestore();
    const dispatch = useDispatch();
    let history = useHistory();
    const [projectMasterList, setData] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    const [isPaymentModalShow, setPaymentModalShow] = useState(false);
    const [activeProjectInfo, setActiveProjectInfo] = useState({});
    const sendBy = localStorage.getItem('userId')
    let apiService = new ApiService()
    // const [isMessageController, setIsMessageController] = useState(false);
    /*React.useEffect(() => {
        // const pageSize = 5;     // your page size
        // const state = { pageNum: 2 };  // your page number
        //
        // firebase.collection("tblProjectMaster")
        //     .orderBy("CreatedDate", "desc")
        //     .startAt(state.pageNum * pageSize) // here we set start point
        //     .limit(pageSize)
        //     .get().then(snapshot => {
        //             debugger
        // });
        // dispatch(actions.setLoader(true));
        firebase.setListeners([
            {
                collection: 'tblProjectMaster',
                storeAs: 'projectMaster',
                orderBy: ["CreatedDate", "desc"],
                limit: 10000
            },
            {
                collection: 'tblUser',
                storeAs: 'userDetails'
            },
        ])
    }, [firebase]);*/

    React.useEffect(() => {
        getJobListByUser()
       /* return () => {
            firebase.unsetListeners([
                {
                    collection: 'tblProjectMaster',
                    storeAs: 'projectMaster',
                    orderBy: ["CreatedDate", "desc"],
                    limit: 10000
                },
                {
                    collection: 'tblUser',
                    storeAs: 'userDetails'
                },
            ])
        };*/
    }, []);

    /*React.useEffect(() => {
        const isLockOne = projectMaster.filter(l => l.isProjectLocked)
        const isLockTwo = projectMasterList.filter(l => l.isProjectLocked)
        if (((projectMaster.length !== projectMasterList.length) || isLockOne !== isLockTwo) && userDetails.length > 0) {
            const data = projectMaster.map((item, i) => {
                const active = userDetails.find((p) => p.id === item.UserId);
                let timeStemp = item.CreatedDate && item.CreatedDate.seconds;
                return {
                    ...item,
                    timeAgo: moment(new Date(timeStemp * 1000)).fromNow(true),
                    nameOfUser: (active && active.FullName) || (active && active.Name) || ""
                };
            });
            dispatch(actions.setLoader(false));
            //setData(data);
        }
    }, [projectMaster, userDetails]);*/


    const getJobListByUser = async () => {
        const res = await apiService.getJobListByUser(sendBy)
        if(res.status){
            const data = res.data.map((item, i) => {
               // let timeStemp = item.CreatedDate && item.CreatedDate._seconds;
                //moment(new Date(timeStemp * 1000)).fromNow(true)
                return {
                    ...item,
                    timeAgo: '',
                };
            });
            setData(data);
        }
    }
    /*const startChat = (details) => {
        const userId = localStorage.getItem("userId");
        firebase
            .collection("tblChatMessage")
            .where("projectId", "==", details.id)
            .where("companyId", "==", userId)
            .where("userId", "==", details.UserId)
            .get()
            .then(function (querySnapshot) {
                if (querySnapshot.empty) {
                    firebase
                        .collection("tblChatMessage")
                        .add({
                            companyId: userId,
                            userId: details.UserId,
                            jobTitle: details.Title,
                            jobDescription: details.Description,
                            jobImage: (details.Files && details.Files[0]) || "",
                            createdAt: new Date(),
                            updatedDate: new Date(),
                            projectId: details.id,
                            chat: []
                        })
                        .then((docRef) => {
                            history.push(`/company/company-offers?userId=${details.UserId}&projectId=${details.id}`);
                            dispatch(actions.setLoader(false));
                        })
                        .catch((error) => {
                            toast.error("Something went wrong please try again");
                            dispatch(actions.setLoader(false));
                        });
                } else {
                    history.push(`/company/company-offers?userId=${details.UserId}&projectId=${details.id}`);
                    dispatch(actions.setLoader(false));
                }
            })
            .catch(function (error) {
                dispatch(actions.setLoader(false));
            });
    };*/

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    };

    const handleModal = (item) =>{
        if(isOpenModal ===false){
            setSelectedRecord(item)
            setOpenModal(true)
        } else {
            setSelectedRecord({})
            setOpenModal(false)
        }

    }

    const notificationSend = (clone, ind) => {
         const  details = clone && clone[ind]
         firebase.collection("tblNotification").add({
                companyId: sendBy,
                userId: details.UserId,
                createdAt: new Date(),
                projectId: details.id,
                notificationType: "payment",
                isRead: false,
                isDeleted: false,
                notificationMessage: `${details.nameOfUser} send you ${details.Title} new offer`
            }).then((res) => {
            }).catch((e) => {
            })
    }

    /*const updateStatus = (resData) =>{
        firebase.collection("tblProjectMaster").doc(activeProjectInfo.id).set({
            ...activeProjectInfo,
            isProjectLocked: true,
            lockedUserId: sendBy,
            paymentId: (resData.charge && resData.charge.id)
        }).then((doc) => {
            const clone = [...projectMasterList]
            const ind = clone.findIndex(l => l.id === activeProjectInfo.id)
            clone[ind].isProjectLocked = true
            clone[ind].lockedUserId = sendBy
            setData(clone)
            startChat(activeProjectInfo)
            console.log("success")
            notificationSend(clone, ind)
        }).catch(error => {
            dispatch(actions.setLoader(false));
            console.log("error")
        });
    }*/

 /*   const handlePaymentSuccess = (resData) =>{
        dispatch(actions.setLoader(true));
        updateStatus(resData)
    }
*/


    return (
        <div id="wrapper">
            <Dashboardheader />
            <CompanySideBar />
            {isOpenModal && <ModalsSlider isOpenModal={isOpenModal} handleModal={handleModal} selectedRecord={selectedRecord} />}
           {/* {isPaymentModalShow &&
                <PaymentModal
                    isPaymentLoading={isPaymentLoading}
                    isPaymentModalShow={isPaymentModalShow}
                    activeProjectInfo={activeProjectInfo}
                    handlePaymentSuccess={handlePaymentSuccess}
                    handlePaymentModal={handlePaymentModal}/>}*/}
            <div id="page-wrapper" className={`menu-push`}>
                {/*<a id="messageBox" className="settingbtn"
                    onClick={isMessageController ? onCloseMessageController : onOpenMessageController}>
                    <i className={isMessageController ? "fas fa-times" : "fas fa-cog"} />
                </a>*/}
                <div className="container-fluid p-0">
                    <div className="row">
                        {
                            projectMasterList.length > 0 &&
                            <div className="col-md-12">
                                {projectMasterList.map((item, ind) => {
                                    return (
                                        <div className="product_inner mt-0 mb-4 company_dashboard_main cd-ribbon active"
                                             key={ind}>
                                            <div className={`testimonials ${item.Files.length <= 1 ? "" : "multi-slide"}`}>
                                                <Slider {...settings}>
                                                    {item.Files.map((img) => (
                                                        <div className="testimonial_box" key={img}>
                                                            <img src={img === "no_image" ?  images.slide1 : img} className="img-fluid" alt={img} onClick={()=>handleModal(item)} />
                                                        </div>
                                                    ))}
                                                </Slider>
                                            </div>
                                            <div className="content-box">

                                                    <h5>{item.nameOfUser} {item.IsActive && <span> ACTIVE </span>}
                                                        <span className="hourbox">{item.timeAgo}</span>
                                                    </h5>
                                                <h5>{item && item.email}</h5>
                                                <h5>{(item && item.telephone) || "1234567890"}</h5>
                                                <h5>{item.nameOfUser} {item.IsActive && <span> ACTIVE </span>}
                                                    <span className="hourbox">{item.timeAgo}</span>
                                                </h5>
                                                <h4> {item.Title} </h4>
                                                <div className={"job_discripation"}>
                                                    <ReadMoreAndLess className="read-more-content" wordLimit={100}
                                                                     readMoreText=" Mer"
                                                                     readLessText=" Mindre">{item.description}</ReadMoreAndLess>
                                                </div>
                                                {item.address && (
                                                    <h5 className="infolocation">
                                                        <i className="fas fa-map-marker-alt" />
                                                        {item.address}
                                                    </h5>
                                                )}
                                                {/*<a className="chatbox" onClick={() => startChat(item)}>*/}
                                                {/*    <img src={images.chatmsg} alt="" /> Start Chat*/}
                                                {/*</a>*/}
                                                <a className="chatbox" onClick={()=>handleModal(item)}>
                                                    <img src={images.chatmsg} alt="" /> Öppen
                                                </a>
                                                {/*{
                                                    item.lockedUserId === sendBy && item.isProjectLocked ?
                                                    <a className="chatbox" onClick={()=>history.push(`/company/company-offers?userId=${item.UserId}&projectId=${item.id}`)}>
                                                        <img src={images.chatmsg} alt="" /> Öppen
                                                    </a> :
                                                    item.isProjectLocked ?
                                                    <a className="chatbox bg-secondary">
                                                        <img src={images.chatmsg} alt="" /> Ej tillgängligt
                                                    </a> :
                                                    <a className="chatbox" onClick={()=>handlePaymentModal(item)}>
                                                        <img src={images.chatmsg} alt="" /> Lås upp uppdrag
                                                    </a>
                                                }*/}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        }
                    </div>
                </div>
            </div>
          {/*  {
                isMessageController && <CompanyMessageController isMessageController={isMessageController} />
            }*/}
        </div>
    );
};

export default compose(
    withFirestore,
    connect((state) => ({
        projectMaster: (state.firestore.ordered && state.firestore.ordered.projectMaster) || [],
        userDetails: (state.firestore.ordered && state.firestore.ordered.userDetails) || []
    }))
)(CompanyDashboard)