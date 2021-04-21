import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";

const CompanyOffersFinishedSent = () => {
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
                        <div className="offerbox-main">
                            <div className="offerbox-main-wrapper-box">
                                <a className="chat-img" href="/#">
                                    <img src={images.chat1} alt=""></img>
                                </a>
                                <div className="offer-body-wrapper">
                                    <h5>Work is Finished</h5>
                                    <h4>11:45 AM</h4>
                                </div>
                            </div>
                            <div className="offer-price">
                                <a href="/#">$1200</a>
                            </div>
                            <div className="green-confirm-box">
                                <a href="/#">Confirmed <i className="fa fa-check" aria-hidden="true"></i></a>
                            </div>
                        </div>
                        <div className="offerbox-main green-work-finish">
                            <div className="offerbox-main-wrapper-box">
                                <div className="offer-body-wrapper">
                                    <h5>Payment Recieved</h5>
                                    <h4>11:45 AM</h4>
                                </div>
                            </div>
                            <div className="offer-price">
                                <a href="/#">$1200</a>
                            </div>
                            <div className="offer-message">
                                <a href="/#">Rate the consumer</a>
                            </div>
                        </div>
                    </div>
                    <div className="sendoffer-box">
                        <div className="send-offer">
                            <div className="send-inner-box">
                                <h5>Send New <br/> Offer</h5>
                                <div className="offerbox">
                                    <input type="number" placeholder="$650"/>
                                </div>
                                <div className="send-btn">
                                    <a href="/#">Send</a>
                                </div>
                                <a className="close-btn"><i className="fas fa-times"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="sendchat-box">
                        <div className="dolarbox">
                            <a className="dolarbox-img sendbox"><img src="images/dolar-icon.png" alt=""></img></a>
                            <div className="lingicon">
                                <input type="file" className="upload_btn"/>
                                <i className="fas fa-paperclip clipicon"></i>
                                <input className="message-box" type="text" placeholder="Tyep Your message here..."/>
                                <a href="/#"><i className="fas fa-paper-plane papericon"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CompanyOffersFinishedSent;