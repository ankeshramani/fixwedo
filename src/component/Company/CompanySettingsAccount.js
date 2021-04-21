import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";

const CompanySettingsAccount = () => {
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
                            <h5><a href="/company/settings-account">Account1</a></h5>
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
                                    <h4>Virginia Mowers Inc.</h4>
                                    <a className="edit-profile" href="/#">Ändra profil</a>
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
                                <div className="orgbox-main">
                                    <div className="org-box-right">
                                        <h6>Organization No. <span>15 52 65 35 45 65 88</span></h6>
                                    </div>
                                    <div className="org-box-mail">
                                        <a href="mailto:virginia.m1@xyz.com">virginia.m1@xyz.com</a>
                                    </div>
                                </div>
                                <div className="address-box">
                                    <div className="address">
                                        <h4>Address</h4>
                                    </div>
                                    <div className="address-content">
                                        <p>Virginia Mowers, Andrew Square, <br/> 5 Park Avenue, Manhattan New York</p>
                                    </div>
                                    <div className="org-box-mail">
                                        <a href="tel:+1 9876543210">+1 9876543210</a>
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
export default CompanySettingsAccount;