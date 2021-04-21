import React from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import Dashboardsidebar from '../Layout/DashboardSideBar';

import images from "../../utils/ImageHelper";

const OffersConfirmed = () => {
    return (
        <div id="wrapper">
            <Dashboardheader></Dashboardheader>
            <Dashboardsidebar></Dashboardsidebar>
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
		 				<div className="accepted-box-bg m-b-0">
		                    <div className="accepted-box-body">
		                        <div className="right-img">
									<img src={images.v2} alt=""></img>
									<h5>Matthew Scott</h5>
								</div>
								<div className="line-wrapper-2">
									<a href="/#">$950</a>
								</div>
								<div className="right-img">
									<img src={images.privatelogo} alt=""></img>
									<h5>Virginia Mowers Inc.</h5>
								</div>
		                    </div>	
		                    <div className="bottom-two-btn">
		                    	<a className="bottom-two-box" href="/#">Accepted <i className="fa fa-check" aria-hidden="true"></i></a>
		                    	<a className="bottom-two-box" href="/#">Confirmed <i className="fa fa-check" aria-hidden="true"></i></a>
		                    </div>
		                    <div className="congrats-msg">
		                    	<div className="congrats-msg-box">
		                    		<div className="check-icon">
			                    		<img src={images.congratsicon} alt=""></img>
			                    	</div>
			                    	<div className="congrats-msg-script">
			                    		<p>Congratulations, You have a deal! <br/> Now use this chat to discuss further details.</p>
			                    	</div>
		                    	</div>
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
	                    <div className="row m-b-0 send-chat">
	                        <div className="col">
	                            <div className="msg m-b-20">
	                                <p>Lorem ipsum dolor sit amet, consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut labore et dolore magna aliqua. consectetur adi iscing elit, sed do eiusmod tempor incidiunt ut. onsectetur adi iscing elit, sed do eiusmod tempor.</p>
	                            </div>
	                            <p className="timetext">11:17 AM</p>
	                        </div>
	                    </div>
		 			</div>
		 			<div className="sendoffer-box">
		 				<div className="send-offer">
		 					<div className="send-inner-box">
		 						<h5>Send New <br/> Offer</h5>
		                		<div className="offerbox">
		                			<input type="number" placeholder="$650" />
		                		</div>
		                		<div className="send-btn">
		                			<a href="/#">Send</a>
		                		</div>
		                		<a className="close-btn" href="/#"><i className="fas fa-times"></i></a>
		 					</div>
	                	</div>
		 			</div>
                    <div className="sendchat-box">
                    	<div className="dolarbox">
		                    <div className="lingicon paperclip">
								<div className="file-wrapper">
									<input type="file" className="upload_btn" />
									<i className="fas fa-paperclip clipicon"></i>
								</div>
	                            <input className="message-box" type="text" placeholder="Tyep Your message here..." />
	                            <a href="/#"><i className="fas fa-paper-plane papericon"></i></a>
		                    </div>
                    	</div>
                    </div>
		 		</div>
		 	</div>
        </div>
    );
}
export default OffersConfirmed;