import React from "react";
import images from "../../../utils/ImageHelper";
import OffersRate from "../OffersRate";
import CheckoutForm from "./CheckoutForm";
const OffersPayment = ({sendToUser, sendByUser, isOffer, makePayment, isPaid, projectId, companyId}) => {
    return (
        <div className="chat-main-box">
            <div className="accepted-box-bg greeb-box m-b-0">
                <div className="accepted-box-body offer_conform">
                    <div className="right-img">
                        <img src={sendToUser.ProfileImage || images.avatarImg} alt="user"/>
                        <h5>{sendToUser.FullName}</h5>
                    </div>
                    <div className="green-bg-line">
                        <a >${isOffer.offerAmount}</a>
                    </div>
                    <div className="right-img">
                        <img src={sendByUser.ProfileImage || images.avatarImg} alt="user"/>
                        <h5>{sendByUser.FullName}</h5>
                    </div>
                </div>
                <div className="bottom-two-btn green-bottom-box">
                    <a className="bottom-two-box" >Accepted <i className="fa fa-check" aria-hidden="true"/></a>
                    <a className="bottom-two-box" >Confirmed <i className="fa fa-check" aria-hidden="true"/></a>
                </div>
                <div className="congrats-msg congrats-green-msg">
                    <div className="congrats-msg-box">
                        <div className="check-icon">
                            <img src={images.congratsiconwhite} alt="img"/>
                        </div>
                        <div className="congrats-msg-script">
                            <p>You’ve Confirmed, Work is finished! <br/> Now make a payment and then rate the worker.</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                isPaid ? <OffersRate projectId={projectId} companyId={companyId}/> :
                <div className="reveiw-box-wrapper m-b-0">
                    <CheckoutForm sendToUser={sendToUser} sendByUser={sendByUser} isOffer={isOffer} makePayment={makePayment} isPaid={isPaid} projectId={projectId} companyId={companyId}/>
                </div>
            }
        </div>
    );
}
export default OffersPayment;