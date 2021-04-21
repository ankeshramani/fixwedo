import React, { Component } from 'react';
import { CardNumberElement, CardExpiryElement, injectStripe, CardCvcElement } from 'react-stripe-elements';
import { toast } from "react-toastify";

class CheckoutForm extends Component {
    constructor(props) {
        super(props);
    }

    makePayment = async () => {
        const { isOffer } = this.props
        let { token } = await this.props.stripe.createToken({ name: "Name" });
        if (token) {
            const amountValue = parseInt(isOffer.offerAmount)
            const amount = (amountValue * 100)
            const payload = {
                token: token,
                amount: amount,
                currency: "USD"
            }
            let response = await fetch(process.env.REACT_APP_API_STRIPE_PAYMENT, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            if (response.ok) console.log("Purchase Complete!", response)
            response.json()
                .then((res) => {
                    const resData = JSON.parse(res.body)
                    if (resData && resData.message === "Success") {
                        this.props.makePayment()
                    } else {
                        console.log(JSON.parse(res.body), 'resss')
                    }
                })
        } else {
            toast.error("Please enter card details")
        }

    }

    render() {
        const { isOffer } = this.props
        return (
            <div className="checkout">
                <div className="reveiw-inner-box">
                    <div className="reveiw-box-title">
                        <h4 className="pr-0">Make Payment <i className="fas fa-times d-none" /></h4>
                    </div>
                    <div className="row bank-detais">
                        <div className="col-xl-6">
                            <select className="drop-card largebox">
                                <option value="">- Select Card -</option>
                                <option value="1">Debit Card</option>
                                <option value="2">Credit Card</option>
                            </select>
                        </div>
                        <div className="col-xl-6">
                            <div className="bake-name largebox">
                                <h5>Matthew Scott</h5>
                            </div>
                        </div>
                    </div>
                    <div className="row bank-detais">
                        <div className="col-xl-6">
                            <div className="bankbox-input largebox">
                                <CardNumberElement />
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="bankbox-input largebox">
                                        <CardCvcElement />
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="bankbox-input date-input">
                                        <CardExpiryElement />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-btn detail-space">
                        <a onClick={this.makePayment}>${isOffer.offerAmount} Make Payment</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default injectStripe(CheckoutForm);