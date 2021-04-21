import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";

const CompanySettingsAccountEdit = () => {
    return (
        <div id="wrapper">
            <Dashboardheader></Dashboardheader>
            <CompanySideBar></CompanySideBar>
            <div className="setting-wrapper">
                <div className="setting-box">
                    <div className="setting-side-box">
                        <a className="setting-img" href="/#">
                            <i className="fas fa-user"></i>
                        </a>
                        <div className="setting-box-body">
                            <h5><a href="/company/settings-account">Account</a></h5>
                            <h6>Personal Account Details</h6>
                        </div>
                    </div>
                    <div className="setting-side-box">
                        <a className="setting-img" href="/#">
                            <i className="fas fa-wallet"></i>
                        </a>
                        <div className="setting-box-body">
                            <h5><a href="/company/companysettings">Payout & Billing</a></h5>
                            <h6>Setm up and Manage Payment & Billing Method</h6>
                        </div>
                    </div>
                    <div className="setting-side-box">
                        <a className="setting-img" href="/#">
                            <i className="fas fa-question-circle"></i>
                        </a>
                        <div className="setting-box-body">
                            <h5><a href="/#">FAQ</a></h5>
                            <h6>Frequently Asked Questions</h6>
                        </div>
                    </div>
                </div>
                <div className="profile-main-wrapper">
                    <div className="profile-title">
                        <h4>Välkommen tillbaka, <span>Virginia Mowers Inc.</span></h4>
                    </div>
                    <div className="profile-box-wrapper">
                        <div className="profile-inner-box">
                            <div className="profilebox">
                                <div className="profile-upload">
                                    <img src={images.profilevlogo} alt=""></img>
                                </div>
                                <div className="upload-profile">
                                    <i className="fas fa-plus"></i>
                                    <input type="file" name="" className="upload-profile-box"/>
                                </div>
                            </div>
                            <div className="profile-status">
                                <div className="profile-content">
                                    <h4>Virginia Mower</h4>
                                    <a href="/#">Save Profile</a>
                                    <p>Lorem ipsum dolor sit amet, consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut labore et dolore tempor incidiunt ut labore magna aliqua. </p>
                                </div>
                                <div className="toggle-main-wrapper">
                                    <div className="toggle-view">
                                        <div className="togglebox">
                                            <input id="c" type="checkbox"/>
                                            <label for="c">
                                                <div className="toggle-swich" data-checked="Company" data-unchecked="Private"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="college-right">
                                        <h4>Colleagues<span>|</span>23 <i className="fas fa-chevron-right"></i></h4>
                                    </div>
                                </div>
                                <div className="row space-wrapper">
                                    <div className="col-md-12 tiltitle">
                                        <h5>Organization No.</h5>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="number-box">
                                            <input type="number" name="" placeholder="15 52 65 35 45 65 88"/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="number-box">
                                            <input type="text" name="" placeholder="virginia.m1@xyz.com"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 tiltitle">
                                        <h5>Address</h5>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="number-box">
                                            <input type="text" name="" placeholder="Virginia Mowers, Andrew Squar..."/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="number-box">
                                            <input type="number" name="" placeholder="+1 9876543210"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CompanySettingsAccountEdit;