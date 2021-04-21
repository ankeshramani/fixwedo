import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import Dashboardsidebar from '../Layout/DashboardSideBar';

import images from "../../utils/ImageHelper";

const PostedJobs = () => {
    return (
        <div id="wrapper">
            <Dashboardheader></Dashboardheader>
            <Dashboardsidebar></Dashboardsidebar>
            <div id="page-wrapper" className="menu-push">
                <a id="messageBox" className="settingbtn"><i className="fas fa-cog"></i></a>
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="private_product_inner mt-0">
                                <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030 <span>6 Hours Ago <i className="fas fa-cog"></i></span></h5>
                                <div className="testimonials private-slider">
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
                                <div className="content-box private-content-box">
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit am incidiunt... <a href="/#">Mer</a></p>
                                </div>
                            </div>
                            <div className="private_product_inner">
                                <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030 <span>6 Hours Ago <i className="fas fa-cog"></i></span></h5>
                                <div className="testimonials private-slider">
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
                                <div className="content-box private-content-box">
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit am incidiunt... <a href="/#">Mer</a></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="private_product_inner mt-0">
                                <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030 <span>6 Hours Ago <i className="fas fa-cog"></i></span></h5>
                                <div className="testimonials private-slider">
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
                                <div className="content-box private-content-box">
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit am incidiunt... <a href="/#">Mer</a></p>
                                </div>
                            </div>
                            <div className="private_product_inner">
                                <h5><i className="fas fa-map-marker-alt"></i> Central Harlem, NYC 10030 <span>6 Hours Ago <i className="fas fa-cog"></i></span></h5>
                                <div className="testimonials private-slider">
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
                                <div className="content-box private-content-box">
                                    <h4>Need person for Landscape gardening of 8000 Sq. ft garden</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod dolor sit amet ut tempor sit am incidiunt... <a href="/#">Mer</a></p>
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
                            <h4>Messages <a href="/#"><img src={images.settings}></img></a></h4>
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
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.<span>3</span></h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
                <div className="userbox">
                    <a className="media-left" href="/#">
                        <img src={images.privatesidelogo} alt=""></img>
                    </a>
                    <div className="media-body">
                        <h6>Virginia Mowers Inc.</h6>
                        <p>Lorem ipsum dolor sit amet, u consectetur...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PostedJobs;