import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {ApiService} from "../../ApiService";
import Slider from "react-slick";
import ReadMoreAndLess from "react-read-more-less";
import images from "../../utils/ImageHelper";
import Login from "../Auth/Login/Login";
import CompanyRegister from "../Company/CompanyRegister";
import PaymentModal from "../Payment/PaymentModal";
import {toast} from "react-toastify";
import ForgotPassword from '../Auth/ForgotPassword'
import {Link, useHistory} from "react-router-dom";

const JobDetails = () => {
    let apiService = new ApiService()
    const [jobDetails, setJobDetails] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isLoginModal, setOpenLoginModal] = useState(false);
    const [isRegisterModal, setOpenRegisterModal] = useState(false);
    const [isPaymentModalShow, setPaymentModalShow] = useState(false);
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    const [isShowForgotModal, setOpenForgotModal] = useState(false);
    const [activeProjectInfo, setActiveProjectInfo] = useState({});
    let loginUserId = localStorage.getItem('userId') || ''

    useEffect(() => {
        getJobDetails()
    }, [])
    const {id} = useParams();

    const getJobDetails = async () => {
        setIsLoading(true)
        const response = await apiService.getJobDetails(id, loginUserId)
        if (response.status) {
            setJobDetails(response.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }
    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    };

   
    if (isLoading) {
        return (
            <div>
                Loading....
            </div>
        )
    }

    const handleLoginModal = (login, signup) => {
        setOpenLoginModal(login)
        setOpenRegisterModal(signup)
    }

    const handleForgot = () => {
        setOpenForgotModal(true)
        setOpenLoginModal(false)
    }

    const handleLoginRegister = ( login, signup,) => {
        setOpenLoginModal(login)
        setOpenRegisterModal(signup)
    }

    const onUnLockJob = async () => {
        if(loginUserId === ""){
            setOpenLoginModal(true)
        } else {
            setActiveProjectInfo(jobDetails)
            setPaymentModalShow(true)
        }
    }

    const handlePaymentSuccess = async (resData) =>{
        const payload = {
            ...activeProjectInfo,
            id: id,
            projectId: id,
            lockedUserId: loginUserId,
            paymentId: resData.charge && resData.charge.id
        }
        console.log(payload)
        const res = await apiService.paymentMethod(payload)
        if(res.status){
            const clone = {...jobDetails}
            clone.lockedUserId = loginUserId;
            setJobDetails(clone)
            toast.success('Betalning genomförd')
        } else {
            toast.error('Payment not successfully')
        }
    }

    const handlePaymentModal = () =>{
        setPaymentModalShow(false)
    }

    const logout = async () => {
        const payload = {
           ...userInfo,
        }
        const data = await  apiService.logout(payload)
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
    
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
    return (
        <div id="wrapper" className="job-list-container">
            <div className="password_header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-sm-2 col-10">
                            <div className="password_header_logo">
                                <a href='/'><img alt="img" src={images.logosvg} /></a>
                            </div>
                        </div>
                        <div className="col-sm-10 col-10">
                            <div className="header_menu">
                                {
                                    userInfo.id ?
                                        <ul>
                                            <li><Link to={"/company/dashboard"}>Välkommen {userInfo.FullName}</Link></li>
                                            <li><a onClick={logout}>Logga ut</a></li>
                                        </ul> :
                                        <ul>
                                            <li onClick={() => handleLoginModal(true, false)}><a>LOGGA IN</a></li>
                                            <li onClick={() => handleLoginRegister(false, true)}><a>ANSLUT FORETAG</a></li>
                                        </ul>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isLoginModal && <Login isModalOpen={isLoginModal} onClose={handleLoginModal} onForgotPassword={handleForgot}/>
            }
            {
                isRegisterModal && <CompanyRegister isRegisterModal={isRegisterModal} onClose={handleLoginRegister}  />
            }
              {
              isShowForgotModal && <ForgotPassword open={isShowForgotModal} onClose={()=>setOpenForgotModal(false)} />
               }
            {isPaymentModalShow &&
            <PaymentModal
                isPaymentLoading={isPaymentLoading}
                isPaymentModalShow={isPaymentModalShow}
                activeProjectInfo={activeProjectInfo}

                handlePaymentSuccess={handlePaymentSuccess}
                handlePaymentModal={handlePaymentModal}/>}
            <div id="page-wrapper" className={`menu-push job-list`}>
            
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="product_inner mt-0 mb-4 company_dashboard_main cd-ribbon active"
                            >
                                <div className={`testimonials ${jobDetails.Files.length <= 1 ? "" : "multi-slide"}`}>
                                    <Slider {...settings}>
                                        {jobDetails.Files.map((img) => (
                                            <div className="testimonial_box" key={img}>
                                                <img src={img === "no_image" ?  images.slide1 : img} className="img-fluid" alt={img}/>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="content-box">
                                    {
                                        loginUserId !== jobDetails.lockedUserId ?
                                            <h5 className={'blur-text'}>xxxxxxxxxxxxxxxxxxxxxxxxx <span> ACTIVE </span>
                                                <span className="hourbox">xxxx</span>
                                            </h5> :
                                            <h5>{jobDetails.nameOfUser} {jobDetails.IsActive && <span> ACTIVE </span>}
                                                <span className="hourbox">{jobDetails.timeAgo}</span>
                                            </h5>
                                    }
                                    {
                                        loginUserId !== jobDetails.lockedUserId ?
                                            <h5 className={'blur-text'}>xxxxxxxxxxxxxxxxxxxxxxxxx
                                            </h5> :
                                            <h5>{(jobDetails && jobDetails.email) || 'Test@gmail.com'}</h5>
                                    }
                                    {
                                        loginUserId !== jobDetails.lockedUserId ?
                                            <h5 className={'blur-text'}>xxxxxxxxxxxxxxxxxxxxxxxxx
                                            </h5> : <h5>{(jobDetails && jobDetails.telephone) || "1234567890"}</h5>}
                                    <h4> {jobDetails.Title} </h4>
                                    <div className={"job_discripation"}>
                                        <div>
                                            <span className="short-text">{jobDetails.description}</span>
                                        </div>
                                    </div>
                                    {jobDetails.Location && (

                                        loginUserId !== jobDetails.lockedUserId ?
                                            <h5 className={'blur-text infolocation'}><i
                                                className="fas fa-map-marker-alt"/> xxxxxxxxxxxxxxxxxxxxxxxxx
                                            </h5> :
                                            <h5 className={` infolocation`}>
                                                <i className="fas fa-map-marker-alt"/>
                                                {jobDetails.Location}
                                            </h5>
                                    )}

                                    {/*{
                                        jobDetails.isProjectLocked ?
                                            <a className="chatbox bg-secondary">
                                                <img src={images.chatmsg} alt=""/> Ej tillgängligt
                                            </a> :
                                            <a className="chatbox" onClick={onUnLockJob}>
                                                <img src={images.chatmsg} alt=""/> Lås upp uppdrag
                                            </a>
                                    }*/}
                                    {
                                        loginUserId !== jobDetails.lockedUserId ?   jobDetails && jobDetails.count >= 3 ? "" :<a className="chatbox" onClick={onUnLockJob}>
                                            <img src={images.chatmsg} alt=""/> Lås upp uppdrag
                                        </a> : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default JobDetails