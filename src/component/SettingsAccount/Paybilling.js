import React, { useState } from "react";
import images from "../../utils/ImageHelper";
import { toast } from "react-toastify";
import moment from "moment";
import { useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/action/actions";
import {getCardImage} from "../../utils/utility";
import {ApiService} from "../../ApiService";
const initialState = {
    CardType: '',
    CardNumber: '',
    Name: '',
    Cvv: '',
    Date: '',
    ExpMonth: '',
    ExpYear: '',
}
const Paybilling = () => {
    const dispatch = useDispatch();
    const [cardDetail, setCardDetail] = useState(initialState);
    const [formError, setErrors] = useState(initialState);
    const [carList, setCarList] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isToggleTable, setIsToggleTable] = useState(true);
    const [isToggleCardDetail, setIsToggleCardDetail] = useState(true);
    const [cardError, setCardError] = useState([]);
    const [cardImg, setCardImg] = useState("");
    const [defaultCard, setDefaultCard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const firebase = useFirestore();
    const userId = localStorage.getItem('userId')
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
    let apiService = new ApiService()
    React.useEffect(() => {
        getCardList()
    }, [])

    const getCardList = async () =>{
        const res = await apiService.getCardList(userId)
        if(res.status){
            setCarList(res.data)
        }
    }


    const createPaymentMethod = async () => {
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
        setIsLoading(true)
        const filterDate = cardDetail.Date && cardDetail.Date.split("/")
        const cNumber = cardDetail.CardNumber && cardDetail.CardNumber.replace(/ /g,'')
        const isCardNumberAvailable = carList.find(p => p.CardNumber === cNumber && p.Exp_month === Number(filterDate && filterDate[0]) && p.Exp_year === Number(filterDate[1]))
        if(isCardNumberAvailable && isCardNumberAvailable.Email){
            setCardError("This card already Added")
            return
        }
        const parts = cardDetail.Date.toString().split(/[-\/]+/);
        const year = parseInt(parts[1], 10);
        const month = parseInt(parts[0], 10);
        setCardError("")
        const emailId = userInfo.Email && userInfo.Email.toLowerCase()
        const payload = {
            type: 'card',
            card: {
                number: cardDetail.CardNumber.replace(/\s/g, ''),
                exp_month: month,
                exp_year: year,
                cvc: cardDetail.Cvv,
            },
            email: emailId,
            CustomerId: '',
            userId: userId,
            defaultCard
        }
        const res = await apiService.paymentMethodCreate(payload)
        if(res.status){
            setIsLoading(false)
            toast.success('Ditt kort har lagts till')
            setCardDetail(initialState)
            setDefaultCard(false)
            getCardList()
        } else {
            setIsLoading(false)
            toast.error('Något gick fel')
        }
        /*firebase.collection("tblPaymentMethods").where("Email", "==", emailId).get()
            .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    const payload = {
                        type: 'card',
                        card: {
                            number: cardDetail.CardNumber.replace(/\s/g, ''),
                            exp_month: month,
                            exp_year: year,
                            cvc: cardDetail.Cvv,
                        },
                        email: emailId,
                        CustomerId: ''
                    }
                    fetch(`${process.env.REACT_APP_API_STRIPE_PAYMENT}/createPaymentMethod`, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(payload)
                    }).then(response => response.json()).then(res => {
                        if (res && res.message === "Success") {
                            firebase.collection("tblPaymentMethods").add({
                                UserId: userId,
                                CustomerId: res.resData.customer,
                                CardId: res.resData.id,
                                CreatedDate: new Date(),
                                Email: emailId,
                                isAddedCardDetails: false,
                                CardNumber: cardDetail && cardDetail.CardNumber && cardDetail.CardNumber.replace(/\s/g, ''),
                                Exp_month: month,
                                Exp_year: year,
                                DefaultCard: defaultCard
                            }).then((res) => {
                                getCardList()
toast.success('Kortregistret lyckades')
                                setCardDetail(initialState)
                                setCardImg("")
                                dispatch(actions.setLoader(false));
                                setDefaultCard(false)
                            })
                        } else {
                            dispatch(actions.setLoader(false));
                            toast.info('Something went wrong')
                        }
                        dispatch(actions.setLoader(false));
                    }).catch((error) => {
                        toast.info('Something went wrong')
                        dispatch(actions.setLoader(false));
                    });
                } else {
                    let cusData = []
                    querySnapshot.forEach((doc) => {
                        firebase.collection("tblPaymentMethods").doc(doc.id).set({
                            ...doc.data(),
                            DefaultCard: false
                        })
                        cusData.push(doc.data())
                    })
                    if(cusData && cusData.length > 0){
                        const payload = {
                            type: 'card',
                            card: {
                                number: cardDetail.CardNumber.replace(/\s/g, ''),
                                exp_month: month,
                                exp_year: year,
                                cvc: cardDetail.Cvv,
                            },
                            email: '',
                            CustomerId: cusData[0] && cusData[0].CustomerId
                        }
                        payLayout(payload)
                    }else {
                        toast.info('Something went wrong')
                        dispatch(actions.setLoader(false));
                    }
                }
            }).catch((err)=>{
            toast.info('Something went wrong')
            dispatch(actions.setLoader(false));
        })*/
    }

    /*const payLayout = async (payload) =>{
        fetch(`${process.env.REACT_APP_API_STRIPE_PAYMENT}/createPaymentMethod`, {
            method: 'POST', // or 'PUT'
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(payload),
        }).then(response => response.json()).then(res => {
            console.log('Success:', res);
            if (res && res.message === "Success") {
                firebase.collection("tblPaymentMethods").add({
                    UserId: userId,
                    CustomerId: res.resData.customer,
                    CardId: res.resData.id,
                    CreatedDate: new Date(),
                    Email: (userInfo && userInfo.Email),
                    CardNumber: cardDetail.CardNumber && cardDetail.CardNumber.replace(/\s/g, ''),
                    Exp_month: payload.card.exp_month,
                    Exp_year: payload.card.exp_year,
                    IsAddedCardDetails: false,
                    DefaultCard: defaultCard
                }).then(() => {
                    setCardDetail(initialState)
                    setDefaultCard(false)
                    getCardList()
                    dispatch(actions.setLoader(false));
                    setCardImg("")
                    toast.success('Kortregistret lyckades')
                })
                dispatch(actions.setLoader(false));
            } else {
                toast.info('Something went wrong')
                dispatch(actions.setLoader(false));
            }
        }).catch((error) => {
            console.log("e", error)
            toast.info('Something went wrong')
            dispatch(actions.setLoader(false));
        });
    }*/

    /*const handleSubmit = () => {
        firebase.collection("tblPaymentMethods").where("email", "==", cardDetail.email).get()
            .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    const payload = {
                        email: cardDetail.email,
                    }
                    let response = await fetch(`${process.env.REACT_APP_API_STRIPE_PAYMENT}/createStripeUser`, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(payload)
                    });
                    response.json()
                        .then((res) => {
                            if (res && res.message === "Success") {
                                firebase.collection("tblPaymentMethods").add({
                                    UserId: userId,
                                    customerId: res.resData.id,
                                    setup_secret: res.setup_secret,
                                    CreatedDate: new Date(),
                                    email: cardDetail.email,
                                    isAddedCardDetails: false
                                }).then(() => {
                                    toast.success('Email register successfully')
                                })
                                dispatch(actions.setLoader(false));
                            } else {
                                console.log(JSON.parse(res.body), 'resss')
                            }
                        })
                } else {
                    toast.error('Email already register Please enter different email ')
                }
            })


    };*/

    const keyPressed = (target) => {
        if (target.charCode === 13) {
            if (isEdit)
                onUpdate()
            else
                createPaymentMethod()
        }
    }

    const formValidate = (name, value) => {
        const re = /^[0-9\b]+$/;
        switch (name) {
            case "Cvv":
                if (!value || value.trim() === "") {
                    return "Vänligen fyll i CVV";
                } else if (value.match(/^[0-9]{3,4}$/)) {
                    return "";
                } else if(re.test(value)){
                    return "CVV är 3 eller 4 siffror";
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
                    return "Vänligen fyll i MM/ÅÅ";
                }  else if (month > 12) {
                    return "Ogiltig månad";
                } else if ((year < currentYear) || ((year === currentYear) && (month < currentMonth))) {
                    return "Ogiltigt datum";
                } else {
                    return '';
                }
            case "CardNumber":
                const newValue = value.replace(/\s+/g, '').trim()
                var visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
                var mastPattern = /^(?:5[1-5][0-9]{14})$/;
                var amexPattern = /^(?:3[47][0-9]{13})$/;
                var discPattern = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
                var isVisa = visaPattern.test(newValue) === true;
                var isMast = mastPattern.test(newValue) === true;
                var isAmex = amexPattern.test(newValue) === true;
                var isDisc = discPattern.test(newValue) === true;
                if (!value || value.trim() === "") {
                    return "Vänligen fyll i kortnummer";
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

    // const onEdit = (record) => {
    //     setCardDetail({
    //         ...record,
    //         Date: `${record.ExpMonth}/${record.ExpYear}`,
    //         CardNumber: record.CardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()
    //     })
    //     setSelectedRecord(record)
    //     setIsEdit(true)
    // }

    const onUpdate = () => {
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
        dispatch(actions.setLoader(true));
        const { CardType, CardNumber, Name, Cvv, CreatedDate, UserId } = cardDetail
        const parts = cardDetail.Date.toString().split(/[-\/]+/);
        const year = parseInt(parts[1], 10);
        const month = parseInt(parts[0], 10);
        firebase.collection("tblPaymentMethods").doc(selectedRecord.id).set({
            UserId,
            CardType,
            CardNumber,
            Name,
            Cvv,
            ExpMonth: month,
            ExpYear: year,
            CreatedDate,
            UpdatedDate: new Date()
        }).then((doc) => {
            const clone = [...carList]
            const index = clone.findIndex((x) => x.id === selectedRecord.id)
            if (index > -1) {
                clone[index] = cardDetail
                setCarList(clone)
            }
            setSelectedRecord({})
            setIsEdit(false)
            setCardDetail(initialState)
            dispatch(actions.setLoader(false));
            toast.success("Card detail updated successfully");

        }).catch(error => {
            dispatch(actions.setLoader(false));
            toast.error("Something went wrong please try again");
        });
    }

    /*const handleNextMultipleCard = (record, length) =>{
        const payload = {
            CardId: record.CardId,
            UserId: record.UserId,
            CardNumber: record.CardNumber,
            Email: record.Email,
            Exp_month: record.Exp_month,
            Exp_year: record.Exp_year,
            CreatedDate: record.CreatedDate,
            DefaultCard: false,
            UpdatedDate: new Date()
        }
        firebase.collection("tblPaymentMethods").doc(record.id).set(payload).then((doc) => {
            if((carList.length - 1) === length){
                getCardList()
            }
            dispatch(actions.setLoader(false));
        }).catch(error => {
            dispatch(actions.setLoader(false));
            toast.error("Something went wrong please try again");
        });
    }*/

    const onSetDefault = async (record) =>{
        dispatch(actions.setLoader(true))
        const payload = {
            DefaultCard: true,
        }
        const res = await  apiService.defaultCard(record.id, userId, payload)
        if(res.status === true){
            getCardList()
            toast.success("Card detail updated successfully");
            dispatch(actions.setLoader(false));
        }else {
            toast.error("Something went wrong please try again");
            dispatch(actions.setLoader(false));
        }
        /*dispatch(actions.setLoader(true));
        firebase.collection("tblPaymentMethods").doc(record.id).set(payload).then((doc) => {
            const allCard = carList.map(i => ({
                ...i,
                DefaultCard: false
            }))
            const clone = [...allCard]
            const index = clone.findIndex((x) => x.id === record.id)
            if (index !== -1) {
                clone[index] = payload
            }
            const finalData = clone.filter(p => !p.DefaultCard)
            finalData.forEach(h => handleNextMultipleCard(h, finalData.length))
            toast.success("Card detail updated successfully");
            if(!finalData.length){
                dispatch(actions.setLoader(false));
            }
        }).catch(error => {
            dispatch(actions.setLoader(false));
            toast.error("Something went wrong please try again");
        });*/
    }

    const onToggleTable = () => {
        setIsToggleTable(!isToggleTable)
    }

    const onToggleCardDetail = () => {
        setIsToggleCardDetail(!isToggleCardDetail)
    }

    const onRemoveCard = async (record) => {
        dispatch(actions.setLoader(true));
        const res = await  apiService.removeCard(record.id)
        if(res.status === true){
            const clone = [...carList]
            const index = clone.findIndex((y) => y.id === record.id)
            clone.splice(index, 1)
            setCarList(clone)
            dispatch(actions.setLoader(false));
            toast.success("Ditt kort har tagits bort");
        } else {
            dispatch(actions.setLoader(false));
            toast.error("Something went wrong please try again");
        }
        /*firebase.collection("tblPaymentMethods").doc(record.id).delete().then((res) => {

        }).catch((error) => {

        })*/
    }

    const onCheckBoxChange = () => {
        setDefaultCard(!defaultCard)
    }

    console.log("carList",carList)
    return (
        <div className="profile-main-wrapper">
            <div className="payout-mathod-box">
                <div className="payout-title">
                    <h5>Betalmetod</h5>
                    <i className={isToggleTable ? `fas fa-angle-up` : `fas fa-angle-down`} onClick={onToggleTable} />
                </div>
                {/*<div className="paypal-wrapper">
					<div className="paypal-icon">
						<img src={images.netbankingicon} alt=""/>
					</div>
					<div className="paypal-name">
						<h4>Net Banking</h4>
						<i className="fas fa-angle-down"/>
					</div>
				</div>
				<div className="paypal-wrapper">
					<div className="paypal-icon">
						<img src={images.card} alt=""/>
					</div>
					<div className="paypal-name">
						<h4>Debit Card</h4>
						<i className="fas fa-angle-down"/>
					</div>
				</div>*/}
                {carList && carList.length ? <div className="row" style={{ display: isToggleTable ? 'block' : 'none' }}>
                    <div className="col-md-12">
                        <table className="table-responsive">
                            <thead>
                                <tr>
                                    {/*<td><strong>Name</strong></td>*/}
                                    {/*<td><strong>Card Type</strong></td>*/}
                                    <td><strong>Card Number</strong></td>
                                    <td><strong>Expired Date</strong></td>
                                    <td><strong>Action</strong></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (carList || []).map((x, i) => {
                                        // const vis = x.CardNumber.slice(-4)
                                        // let countNum = '';
                                        // for (var i = (x.CardNumber.length) - 4; i > 0; i--) {
                                        //     countNum += '*';
                                        // }

                                        return (
                                            <tr key={i} style={{marginBottom: 10}}>
                                                {/*<td style={{width: "20%"}}>{x.Name}</td>*/}
                                                {/*<td style={{width: "20%"}}>{x.CardType}</td>*/}
                                                <td style={{width: "20%"}}>{x.CardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()}</td>
                                                <td style={{width: "10%"}}>{x.Exp_month > 9 ? x.Exp_month : `0${x.Exp_month}`}/{x.Exp_year}</td>
                                                {/*<td style={{width: "10%"}} onClick={() => onEdit(x)}>*/}
                                                {/*    <button className="greenfill-btnbox">Edit</button>*/}
                                                {/*</td>*/}
                                                <td style={{width: "20%"}}>
                                                    <button onClick={() => onRemoveCard(x)} className="greenfill-btnbox mr-2">Remove</button>
                                                    {x.DefaultCard && <button className="greenfill-btnbox df-card">Använd som standardkort</button>}
                                                    {!x.DefaultCard && <button onClick={() => onSetDefault(x)} className="greenfill-btnbox df-card">Set Default</button>}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div> : null}
                <div className="net-banking-wrapper">
                    <div className="net-banking">
                        <div className="paypal-icon net-banking-icon">
                            <img src={images.card} alt="" />
                        </div>
                        <div className="paypal-name net-banking-box">
                            <h4>Kortuppgifter</h4>
                            <i className={isToggleCardDetail ? `fas fa-angle-up` : `fas fa-angle-down`} onClick={onToggleCardDetail} />
                        </div>
                    </div>
                   {/* <div style={{ display: 'block' }}>
                        <div className="row bank-detais">
                            <div className="col-xl-12">
                                <div className="bankbox-input largebox">
                                    <input type="text" placeholder="E-mail" name="email" value={cardDetail.email}
                                        onChange={handleInputChange} />
                                    {formError.Name && <p className="text-danger">{formError.Name}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="detail-btn">
                                <a onClick={handleSubmit}>{isEdit ? 'update details' : 'save details'}</a>
                            </div>
                        </div>
                    </div>*/}

                    <div style={{ display: isToggleCardDetail ? 'block' : 'none' }}>
                        {/*<div className="row bank-detais">*/}
                        {/*    <div className="col-xl-6">*/}
                        {/*        <input type="text" placeholder="E-mail" name="email" value={cardDetail.email}*/}
                        {/*               onChange={handleInputChange} />*/}
                        {/*        {formError.email && <p className="text-danger">{formError.email}</p>}*/}
                        {/*    </div>*/}
                        {/*    <div className="col-xl-6">*/}
                        {/*        <div className="bankbox-input largebox">*/}
                        {/*            <input type="text" placeholder="Name" name="Name" value={cardDetail.Name}*/}
                        {/*                onChange={handleInputChange} />*/}
                        {/*            {formError.Name && <p className="text-danger">{formError.Name}</p>}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="row bank-detais">
                            <div className="col-xl-6">
                                <div className="bankbox-input largebox">
                                    <div className="bankbox-input date-input card-number-input">
                                        <img src={cardImg || images.card}/>
                                        <input type="text" placeholder="Kortnummer" name="CardNumber"
                                            value={cardDetail.CardNumber} onChange={handleInputChange} />
                                    </div>
                                    {formError.CardNumber && <p className="text-danger">{formError.CardNumber}</p>}
                                </div>
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
                                        <div className="bankbox-input date-input">
                                            <i className="fas fa-calendar-alt"/>
                                            <input name="Date" type="text" placeholder="MM/ÅÅ" value={cardDetail.Date}
                                                onChange={handleInputChange} onKeyPress={keyPressed} />
                                            {formError.Date && <p className="text-danger">{formError.Date}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input className="custom-control-input" type="checkbox" id="remCheck" name="remember" checked={defaultCard} onChange={onCheckBoxChange}/>
                            <label className="custom-control-label" htmlFor="remCheck">Använd som standardkort</label>
                        </div>
                        {cardError && <p>{cardError}</p>}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="detail-btn">
                                   <button disabled={isLoading} onClick={createPaymentMethod}><a>{isLoading ? 'Läser in...' : 'SPARA'}</a></button>
                                    {/*<a onClick={isEdit ? onUpdate : createPaymentMethod}>{isEdit ? 'update details' : 'save details'}</a>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/*  <div className="new-payout-method">
                    <a href="#">Add New Payout Method</a>
                </div>*/}
            </div>
        </div>
    );
}
export default Paybilling;