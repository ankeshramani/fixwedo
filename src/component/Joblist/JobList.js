import React, {useEffect, useState} from "react";
import ReadMoreAndLess from "react-read-more-less";
import {ApiService} from "../../ApiService";
import Slider from "react-slick";
import images from "../../utils/ImageHelper";
import {Link, useHistory} from "react-router-dom";
import Login from "../Auth/Login/Login";
import CompanyRegister from "../Company/CompanyRegister";
import PaymentModal from "../Payment/PaymentModal";
import * as actions from "../../redux/action/actions";
import {toast} from "react-toastify";
import ForgotPassword from '../Auth/ForgotPassword'

const JobList = () => {
    let apiService = new ApiService()
    const [jobList, setJobList] = useState([])
    const [isLoginModal, setOpenLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterModal, setOpenRegisterModal] = useState(false);
    const [isPaymentModalShow, setPaymentModalShow] = useState(false);
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    const [activeProjectInfo, setActiveProjectInfo] = useState({});
    const [isShowForgotModal, setOpenForgotModal] = useState(false);
    let history = useHistory();
    let loginUserId = localStorage.getItem('userId') || ''

    useEffect(() => {
        setIsLoading(true)
        getData()
    }, [])

    const getData = async () => {
       
        const response = await apiService.getJobList(loginUserId)
        if (response.status) {

            setJobList(response.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const onReadMore = (record) => {
        history.push(`/job-list/${record.id}`)
    }
    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    };
    const onUnLockJob = async (record) => {
        if(loginUserId === ""){
            setOpenLoginModal(true)
        } else {
            setActiveProjectInfo(record)
            setPaymentModalShow(true)
        }
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

    const handlePaymentSuccess = async (resData) =>{
        const payload = {
            ...activeProjectInfo,
            projectId: activeProjectInfo.id,
            lockedUserId: loginUserId,
            paymentId: resData.charge && resData.charge.id
        }
        const res = await apiService.paymentMethod(payload)
        if(res.status){
           getData()
            toast.success('Betalning genomförd')
        } else {
            toast.error('Payment not successfully')
        }
    }
    const handlePaymentModal = () =>{
        setPaymentModalShow(false)
    }
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
    const userType = (userInfo && userInfo.UserType)

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
                isRegisterModal && <CompanyRegister isRegisterModal={isRegisterModal} onClose={handleLoginRegister} />
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
                    {
                        isLoading ? <span>Läser in....</span> : <div className="row">
                            {
                                (jobList || []).map((item, ind) => {
                                    console.log( item && item.count)
                                    return (
                                        <div className="col-md-6">
                                            <div className="product_inner mt-0 mb-4 company_dashboard_main cd-ribbon active"
                                                 key={ind}>
                                                <div
                                                    className={`testimonials ${item.Files.length <= 1 ? "" : "multi-slide"}`}>
                                                    <Slider {...settings}>
                                                        {item.Files.map((img) => (
                                                            <div className="testimonial_box" key={img}>
                                                                <img src={img === "no_image" ?  images.slide1 : img} className="img-fluid" alt={img}/>
                                                            </div>
                                                        ))}
                                                    </Slider>
                                                </div>
                                                <div className="content-box">
                                                    {item.lockedUserId !== loginUserId ?
                                                        <h5 className={'blur-text'}>xxxxxxxxxxxxxxxxx<span> ACTIVE </span>
                                                            <span className="hourbox">xxxx</span>
                                                        </h5> :
                                                        <h5>{item.nameOfUser} {item.IsActive && <span> ACTIVE </span>}
                                                            <span className="hourbox">{item.timeAgo}</span>
                                                        </h5>
                                                    }
                                                    {loginUserId !== item.lockedUserId ?
                                                        <h5 className={'blur-text'}>xxxxxxxxxxxxxxxxx
                                                        </h5> : <h5>{(item && item.email) || 'Test@gmail.com'}</h5>
                                                    }
                                                    {loginUserId !== item.lockedUserId ?
                                                        <h5 className={'blur-text'}>xxxxxxxxxxxxxxxxx
                                                        </h5> : <h5>{(item && item.telephone) || "1234567890"}</h5>
                                                    }
                                                    <h4> {item.Title} </h4>
                                                    <div className={"job_discripation"}>
                                                        <ReadMoreAndLess className="read-more-content" wordLimit={100}
                                                                         readMoreText=" Mer"
                                                                         readLessText=" Mindre">{item.description}</ReadMoreAndLess>
                                                    </div>
                                                    {item.address && (
                                                        loginUserId !== item.lockedUserId ?
                                                            <h5 className={'blur-text infolocation'}><i
                                                                className="fas fa-map-marker-alt"/> xxxxxxxxxxxxxxxxx</h5> :
                                                            <h5 className={`infolocation`}>
                                                                <i className="fas fa-map-marker-alt"/>
                                                                {item.address}
                                                            </h5>
                                                    )}
                                                    <div>
                                                        <a onClick={() => onReadMore(item)}>Läs mer</a>
                                                    </div>
                                                    {/*{
                                                    item.isProjectLocked ?
                                                        <a className="chatbox bg-secondary">
                                                            <img src={images.chatmsg} alt=""/> Ej tillgängligt
                                                        </a> :
                                                        <a className="chatbox" onClick={() => onUnLockJob(item)}>
                                                            <img src={images.chatmsg} alt=""/> Lås upp uppdrag
                                                        </a>
                                                }*/}
                                                    {
                                                        item && item.count >= 3 ?  '' :  <a className="chatbox" onClick={ loginUserId === item.lockedUserId ? () => onReadMore(item) : () => onUnLockJob(item)}>
                                                            <img src={images.chatmsg} alt=""/> {loginUserId === item.lockedUserId ? "Visa uppdrag" :"Lås upp uppdrag"}
                                                        </a>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}
export default JobList