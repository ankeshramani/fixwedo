import React from "react";
import images from "../../../utils/ImageHelper";

const ConfirmedOffer = ({sendToUser, sendByUser, isOffer, isShowFinishedBtn, finishedWork, isCompanyCompleted}) => {
    return (
        <div className="accepted-box-bg m-b-0 offer-sticky">
            <div className="accepted-box-body offer_conform">
                <div className="right-img">
                    <img src={sendToUser.ProfileImage || images.avatarImg} alt="user"/>
                    <h5>{sendToUser.FullName}</h5>
                </div>
                <div className="line-wrapper-2">
                    <a href="#">${isOffer.offerAmount}</a>
                </div>
                <div className="right-img">
                    <img src={sendByUser.ProfileImage || images.avatarImg} alt="user"/>
                    <h5>{sendByUser.FullName}</h5>
                </div>
            </div>
            <div className="bottom-two-btn">
                <a className="bottom-two-box">Accepted <i className="fa fa-check" aria-hidden="true"/></a>
                <a className="bottom-two-box">Confirmed <i className="fa fa-check" aria-hidden="true"/></a>
                {isShowFinishedBtn && !isCompanyCompleted && <a className="work-btn" href="#" onClick={()=> finishedWork()}>Work Is Finished</a>}
                {isCompanyCompleted &&  isShowFinishedBtn && <a className="work-btn work-bg" href="#">Work Is Finished</a>}
            </div>
            <div className="congrats-msg">
                <div className="congrats-msg-box">
                    <div className="check-icon">
                        <img src={images.congratsicon} alt="" />
                    </div>
                    <div className="congrats-msg-script">
                        <p>Congratulations, You have a deal! <br /> Now use this chat to discuss further details.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmedOffer