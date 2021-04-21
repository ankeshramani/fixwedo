import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";

const CompanyNewOfferSent = () => {
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
                        <div className="chat-side-box chatbox-bg m-b-0">
                            <a className="chat-img" href="/#">
                                <img src={images.chat1} alt=""></img>
                            </a>
                            <div className="chat-box-body">
                                <h5>Matthew Scott</h5>
                                <h4>16 Hours Ago</h4>
                                <div className="salary salary-right">
                                    <a href="/#">$950</a>
                                </div>
                            </div>
                        </div>
                        <div className="row m-b-0 send-chat">
                            <div className="col">
                                <div className="msg m-b-20">
                                    <p>Lorem ipsum dolor sit amet, consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut lab.</p>
                                </div>
                                <p className="timetext">10:17 AM</p>
                            </div>
                        </div>
                        <div className="row m-b-0 received-chat">
                            <div className="col">
                                <div className="msg m-b-20">
                                    <p>Lorem ipsum dolor sit amet, consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut labore et dolore magna aliqua.</p>
                                </div>
                                <p className="timetext">10:32 AM</p>
                            </div>
                        </div>
                        <div className="row m-b-0 received-chat">
                            <div className="col">
                                <div className="msg m-b-20">
                                    <p>Lorem ipsum dolor sit amet, consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut labore et dolore magna aliqua. consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut.</p>
                                </div>
                                <p className="timetext">10:35 AM</p>
                            </div>
                        </div>
                        <div className="chat-side-box chatbox-bg chat-line m-b-0">
                            <a className="chat-img" href="/#">
                                <img src={images.privateoffe1} alt=""></img>
                            </a>
                            <div className="chat-box-body">
                                <h5>New Offer</h5>
                                <h4>10:45 AM</h4>
                                <div className="salary salary-right">
                                    <a href="/#">$650</a>
                                </div>
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
                            <a className="dolarbox-img sendbox"><img src={images.dolaricon} alt=""></img></a>
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
export default CompanyNewOfferSent;