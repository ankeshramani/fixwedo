import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import {toast} from "react-toastify";
import {connect, useDispatch} from "react-redux";
import * as actions from "../../redux/action/actions";
import moment from "moment";
import {useFirestore, withFirestore} from "react-redux-firebase";
import {getCardImage} from "../../utils/utility";
import images from "../../utils/ImageHelper";
import {ApiService} from "../../ApiService";

const initialState = {
    CardType: '',
    CardNumber: '',
    Name: '',
    Cvv: '',
    Date: '',
    ExpMonth: '',
    ExpYear: '',
    email: ''
}

const PaymentModal = ({isPaymentModalShow, handlePaymentModal, handlePaymentSuccess, isPaymentLoading, ...props}) => {
   /* const userId = localStorage.getItem('userId')
    const dispatch = useDispatch();
    const firebase = useFirestore();*/
    const [cardDetail, setCardDetail] = useState(initialState);
    const [formError, setErrors] = useState(initialState);
    const [selectedCard, setCard] = useState({});
    const [cardList, setCardList] = useState([]);
    const [cardImg, setCardImg] = useState("");
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const userId = localStorage.getItem('userId')
    let apiService = new ApiService()
    React.useEffect(() => {
        getCardList()
    }, [])
    /*React.useEffect(() => {
        firebase.collection("tblPaymentMethods").where("UserId", "==", userId).get().then(function(querySnapshot) {
            let cardItems = []
            querySnapshot.forEach(function(doc) {
                cardItems.push(doc.data())
                if(querySnapshot.size === cardItems.length){
                    setCardList(cardItems)
                    const defaultCard = cardItems.find((x) => x.DefaultCard === true)
                    const cardInfoDetails = {
                        CardNumber: defaultCard.CardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim(),
                        Cvv: '',
                        Date: `${defaultCard.Exp_month}/${defaultCard.Exp_year}`,
                        ExpMonth: defaultCard.Exp_month,
                        ExpYear: defaultCard.Exp_year,
                    }
                    setCard((defaultCard && defaultCard.CardId) || "")
                    setCardDetail(cardInfoDetails)
                    setCardImg(getCardImage(defaultCard.CardNumber))
                }
            });
        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }, []);*/

    const getCardList = async () =>{
        const res = await apiService.getCardList(userId)
        if(res.status){
            const defaultCard = (res && res.data || []).find((x) => x.DefaultCard === true) || (res && res.data && res.data[0])
            let cardInfoDetails = {
                CardNumber: defaultCard && defaultCard.CardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim(),
                Cvv: '',
                Date: `${(defaultCard && defaultCard.Exp_month) || ''}/${(defaultCard && defaultCard.Exp_year) || ''}`,
                ExpMonth: defaultCard && defaultCard.Exp_month,
                ExpYear: defaultCard && defaultCard.Exp_year,
            }
            setCardDetail(cardInfoDetails)
            setCardList(res.data)
            setCardImg(getCardImage(defaultCard && defaultCard.CardNumber))
            setCard((defaultCard && defaultCard.CardId) || "")
        }
    }
    const handlePayment = async () => {
      
        let validationErrors = {};
        Object.keys(cardDetail).forEach(name => {
            const error = formValidate(name, cardDetail[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoadingPayment(true)
      //  dispatch(actions.setLoader(true));
        const parts = cardDetail.Date.toString().split(/[-\/]+/);
        const year = parseInt(parts[1], 10);
        const month = parseInt(parts[0], 10);
        const amountValue = 10
        const amount = (amountValue * 100)
        const payload = {
            amount: amount,
            currency: "USD",
            card: {
                number: cardDetail.CardNumber.replace(/\s/g, ''),
                exp_month: month,
                exp_year: year,
                cvc: cardDetail.Cvv,
            },
        }

        fetch(process.env.REACT_APP_API_STRIPE_PAYMENT, {
            method: 'POST', // or 'PUT'
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(payload)
        }).then(response => response.json()).then(res => {
            const resData = res.body
            if ((resData && resData.message) === "Success") {
                handlePaymentSuccess(resData)
                handlePaymentModal()
                setIsLoadingPayment(false)
            } else {
                setIsLoadingPayment(false)
                toast.info('Something went wrong please try again')
            }
        }).catch((error) => {
            setIsLoadingPayment(false)
            console.log("error", error)
            toast.info('Something went wrong please try again')
        });
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "Cvv":
                if (!value || value.trim() === "") {
                    return "CVV krävs";
                } else if (value.match(/^[0-9]{3,4}$/)) {
                    return "";
                } else {
                    return "CVV är 3 eller 4 siffror";
                }
            case "Date":
                const d = new Date();
                const currentYear = parseInt(moment().format("YY"));
                const currentMonth = d.getMonth() + 1;
                const parts = value.toString().split(/[-\/]+/);
                const year = parseInt(parts[1], 10);
                const month = parseInt(parts[0], 10);
                if ((value.length !== 5) || !value) {
                    return "Ange MM / YY";
                } else if (month > 12) {
                    return "Ogiltig månad";
                    // eslint-disable-next-line eqeqeq
                } else if ((year < currentYear) || ((year == currentYear) && (month < currentMonth))) {
                    return "Ogiltigt datum";
                } else {
                    return '';
                }
            case "CardNumber":
                const newValue =( value || '').replace(/\s+/g, '').trim()
                var visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
                var mastPattern = /^(?:5[1-5][0-9]{14})$/;
                var amexPattern = /^(?:3[47][0-9]{13})$/;
                var discPattern = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
                var isVisa = visaPattern.test(newValue) === true;
                var isMast = mastPattern.test(newValue) === true;
                var isAmex = amexPattern.test(newValue) === true;
                var isDisc = discPattern.test(newValue) === true;
                if (!value || value.trim() === "") {
                    return "Kortnummer krävs";
                } else if (isVisa || isMast || isAmex || isDisc) {
                    if (isVisa) {
                        return ''
                    } else if (isMast) {
                        return ''
                    } else if (isAmex) {
                        return ''
                    } else if (isDisc) {
                        return ''
                    } else {
                        return "";
                    }
                } else {
                    return "Ange ett giltigt kortnummer.";
                }
            default: {
                return "";
            }
        }
    };

    const handleInputChange = (event) => {
        let { name, value } = event.target
        if (name === "CardNumber") {
            if (value.length > 19) {
                return;
            } else if (name === "CardNumber" && value.length) {
                value = value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
            }
            setCardImg(getCardImage(value))
        }
        if (name === "Date") {
            if(value.match(/[^0-9/]/)){
                return false;
            } 
            if (value.length > 5) {
                return;
            }
            value = value.replace(/ /g, '');
            if (value.length === 2 && cardDetail.Date.length < 3) {
                value = `${value}/`;
            }
        }
        if (name === "Cvv") {
            value = value.replace(/ /g, '');
            if (value.length > 4) {
                return;
            }
        }
        setCardDetail(cardDetail => ({
            ...cardDetail,
            [name]: value
        }));
        setErrors(formError => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
    }

    const handleSelect = (e) =>{
        if(e.target.value){
            const activeCard = cardList.find(l => l.CardId === e.target.value)
            if(activeCard.CardId === e.target.value){
                const cardInfo = {
                    CardNumber: activeCard.CardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim(),
                    Cvv: '',
                    Date: `${activeCard.Exp_month}/${activeCard.Exp_year}`,
                    ExpMonth: activeCard.Exp_month,
                    ExpYear: activeCard.Exp_year,
                }
                setCardDetail(cardInfo)
                setCardImg(getCardImage(activeCard.CardNumber))
            }
            setCard(e.target.value)
        }else {
            setCard("")
            setCardImg("")
            setCardDetail(initialState)
        }
    }

    return (
            <Modal
                className="make-payment-modal"
                show={isPaymentModalShow}
                onHide={() => handlePaymentModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Bekräfta betalning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="checkout">
                        <div className="reveiw-inner-box">
                            <div className="row bank-detais">
                                {
                                    cardList.length > 0 &&
                                    <div className="col-12">
                                        <select className="drop-card largebox" value={selectedCard} onChange={handleSelect}>
                                            <option value="">- Välj kort -</option>
                                            {
                                                cardList.map((item, ind) =>{
                                                    return(<option value={item.CardId} key={ind}>
                                                        {item.CardNumber && item.CardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim() + "  " + item.Exp_month + "/" +item.Exp_year}
                                                    </option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                }
                            </div>
                            <div className="row bank-detais">
                                <div className="col-xl-6">
                                    <div className="bankbox-input largebox card-number-input">
                                        <img src={cardImg || images.card}/>
                                        <input type="text" placeholder="Kortnummer" name="CardNumber"
                                               value={cardDetail.CardNumber} onChange={handleInputChange} />
                                    </div>
                                    {formError.CardNumber && <p className="text-danger">{formError.CardNumber}</p>}
                                </div>
                                <div className="col-xl-6">
                                    <div className="row">
                                        <div className="col-xl-6">
                                            <div className="bankbox-input largebox">
                                                <input type="number" placeholder="CVC" name="Cvv" maxLength={3} value={cardDetail.Cvv}
                                                       onChange={handleInputChange} />
                                                {formError.Cvv && <p className="text-danger">{formError.Cvv}</p>}
                                            </div>
                                        </div>
                                        <div className="col-xl-6">
                                            <div className="bankbox-input date-input card-expiry-input mb-0">
                                                <input name="Date" type="text" placeholder="MM/ÅÅ" value={cardDetail.Date}
                                                       onChange={handleInputChange}  />
                                                {formError.Date && <p className="text-danger">{formError.Date}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div id="wrapper" className="mt-0">
                    <button className="secondary greenfill-btnbox" onClick={handlePaymentModal}>Stäng</button>&nbsp;&nbsp;
                    <button disabled={isLoadingPayment} className="primary greenfill-btnbox" onClick={handlePayment}>{isLoadingPayment ? 'Läser in...' : '$10 Betala XX SEK'}</button>
                    </div>
                </Modal.Footer>
            </Modal>

    )
}
export default PaymentModal