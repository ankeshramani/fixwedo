import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";

const CompanyPostedJobs = () => {
    return (
        <div id="wrapper">
            <Dashboardheader></Dashboardheader>
            <CompanySideBar></CompanySideBar>
            <div id="page-wrapper" className="menu-push">
                <a id="messageBox" className="settingbtn"><i className="fas fa-cog"></i></a>
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="product_inner mt-0">
                                <div className="testimonials">
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide2} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h5>Ria S. McMohan<span>Active</span><span className="hourbox">6 hours ago</span></h5>
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit wiow am incidiunt psum dolor sit amet, consectetur adipiscing elit, sed do... <a href="/#">Mer</a></p>
                                    <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030</h5>
                                    <a className="chatbox" href="/#"><img src="images/forum-24px.png" alt=""></img>Start Chat</a>
                                </div>
                            </div>
                            <div className="product_inner">
                                <div className="testimonials">
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide2} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h5>Ria S. McMohan<span className="hourbox">6 hours ago</span></h5>
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit wiow am incidiunt psum dolor sit amet, consectetur adipiscing elit, sed do... <a href="/#">Mer</a></p>
                                    <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030</h5>
                                    <a className="chatbox" href="/#"><img src="images/forum-24px.png" alt=""></img>Start Chat</a>
                                </div>
                            </div>
                            <div className="product_inner">
                                <div className="testimonials">
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide2} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h5>Ria S. McMohan<span className="hourbox">6 hours ago</span></h5>
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit wiow am incidiunt psum dolor sit amet, consectetur adipiscing elit, sed do... <a href="/#">Mer</a></p>
                                    <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030</h5>
                                    <a className="chatbox" href="/#"><img src="images/forum-24px.png" alt=""></img>Start Chat</a>
                                </div>
                            </div>
                            <div className="product_inner">
                                <div className="testimonials">
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide2} className="img-fluid" alt=""></img>
                                    </div>
                                    <div className="testimonial_box">
                                        <img src={images.slide1} className="img-fluid" alt=""></img>
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h5>Ria S. McMohan<span className="hourbox">6 hours ago</span></h5>
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit wiow am incidiunt psum dolor sit amet, consectetur adipiscing elit, sed do... <a href="/#">Mer</a></p>
                                    <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030</h5>
                                    <a className="chatbox" href="/#"><img src="images/forum-24px.png" alt=""></img>Start Chat</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="sidebar" className="users chat-user">
                <div className="message-box">
                    <div className="chat-search-box">
                        <a className="back_friendlist">
                            <i className="feather icon-x"></i>
                        </a>
                        <div className="settingbox">
                            <h4>Messages
                                <a href="/#"><img src={images.settings} alt=""></img></a>
                            </h4>
                        </div>
                        <div className="right-icon-control">
                            <div className="input-group input-group-button">
                                <i className="fas fa-search searchbox"></i><input type="text" className="search-control" placeholder="Search by Name"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user1} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Ria S. McMohan</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user2} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Matthew Scott<span>3</span></h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user3} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Mohiny Nixon</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user4} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Jake Davis</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user5} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Shelly Afonso</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user6} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Robin Newman</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user7} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Albert Morgan</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.user8} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Ria S. McMohan</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CompanyPostedJobs;