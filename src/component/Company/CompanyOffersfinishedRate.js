import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";

const CompanyOffersfinishedRate = () => {
    return (
        <div id="wrapper">
            <Dashboardheader></Dashboardheader>
            <CompanySideBar></CompanySideBar>
            <div className="chatwapper">
                <div className="chat-main-wrapper">
                    <div className="chat-side-box chatbox-body">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h6>ACCEPTED <span>6 Hours Ago</span></h6>
                        </div>
                        <div className="salary">
                            <span>New</span>
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                    <div className="chat-side-box chatbox-body">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h4>8 Hours Ago</h4>
                        </div>
                        <div className="salary">
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                    <div className="chat-side-box chatbox-body">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h6>ACCEPTED <span>6 Hours Ago</span></h6>
                        </div>
                        <div className="salary">
                            <span>New</span>
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                    <div className="chat-side-box chatbox-body">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h6>ACCEPTED <span>12 Hours Ago</span></h6>
                        </div>
                        <div className="salary">
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                    <div className="chat-side-box chatbox-body opasity-box">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h4>12 Hours Ago</h4>
                        </div>
                        <div className="salary">
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                    <div className="chat-side-box chatbox-body opasity-box">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h4>12 Hours Ago</h4>
                        </div>
                        <div className="salary">
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                    <div className="chat-side-box chatbox-body opasity-box">
                        <a className="chat-img" href="/#">
                            <img src={images.chat1} alt=""></img>
                        </a>
                        <div className="chat-box-body">
                            <h5>Matthew Scott</h5>
                            <h4>12 Hours Ago</h4>
                        </div>
                        <div className="salary">
                            <a href="/#">$2000</a>
                        </div>
                    </div>
                </div>
                <div className="chat-main-box">
                    <div className="chat-inner">
                        <div className="accepted-box-bg greeb-box m-b-0">
                            <div className="accepted-box-body">
                                <div className="right-img">
                                    <img src={images.v2} alt=""></img>
                                    <h5>Matthew Scott</h5>
                                </div>
                                <div className="green-bg-line">
                                    <a href="/#">$1200</a>
                                </div>
                                <div className="right-img left-img">
                                    <img src={images.vlogo} alt=""></img>
                                    <h5>Virginia Mowers Inc.</h5>
                                </div>
                            </div>  
                            <div className="bottom-two-btn green-bottom-box">
                                <a className="bottom-two-box" href="/#">Accepted <i className="fa fa-check" aria-hidden="true"></i></a>
                                <a className="bottom-two-box" href="/#">Confirm <i className="fa fa-check" aria-hidden="true"></i></a>
                            </div>
                            <div className="congrats-msg congrats-green-msg">
                                <div className="congrats-msg-box">
                                    <div className="check-icon">
                                        <img src={images.congratsiconwhite} alt=""></img>
                                    </div>
                                    <div className="congrats-msg-script">
                                        <p>Congratulations, Work is finished! <br/> You’ve received the payment now rate the consumer. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reveiw-box-wrapper">
                        <div className="reveiw-inner-box">
                            <div className="reveiw-box-title">
                                <h4>Payment Received! Now please Rate the Consumer. <i className="fas fa-times"></i></h4>
                            </div>
                            <div className="reveiw-star">
                                <ul className="reveiw-star-icon">
                                    <li><i className="fas fa-star"></i></li>
                                    <li><i className="fas fa-star"></i></li>
                                    <li><i className="fas fa-star"></i></li>
                                    <li><i className="fas fa-star"></i></li>
                                    <li><i className="fas fa-star"></i></li>
                                </ul>
                            </div>
                            <div className="reveiw-submit">
                                <a href="/#">submit</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CompanyOffersfinishedRate;