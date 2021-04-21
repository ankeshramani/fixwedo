import React, {useState} from "react";
import {useFirebase, useFirestore} from "react-redux-firebase";
import images from "../../utils/ImageHelper";
import {toast} from "react-toastify";
import * as actions from "../../redux/action/actions";
import {useDispatch} from "react-redux";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import {ApiService} from "../../ApiService";

const initialState = {
    AboutUs: "",
    Address: "",
    Email: "",
    FullName: "",
    Name: "",
    OrganizationNo: "",
    Password: "",
    ConfirmPassword: "",
    Phone: "",
    PostCode: "",
    ProfileImage: "",
    UserName: "",
    UserType: "",
    CompanyName: "",
    OrganizationNumber: ""
}

export default function CompanyRegister({isRegisterModal, onClose}) {
    let apiService = new ApiService()
    const [formData, setFormData] = useState(initialState);
    const [formError, setErrors] = useState(initialState);
    const [isLoading, setLoading] = useState(false);

    const keyPressed = (target) => {
        if (target.charCode === 13) {
            handleSubmit(target)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
        Object.keys(formData).forEach(name => {
            const error = formValidate(name, formData[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true)
        const emailId = formData.Email && formData.Email.toLowerCase()
        const payload = {
            emailId: emailId,
            PostCode: formData.PostCode,
            Password: formData.Password,
            FullName: formData.FullName,
            OrganizationNumber: formData.OrganizationNumber,
            Address: formData.Address,
            CompanyName: formData.CompanyName,
            telephone: formData.telephone,
        }
        const response = await apiService.createUser(payload)
        if(response.status){
            console.log("=====================res=======>",response)
            let responseMail = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${emailId}&emailName=newuserregistercompany&docId=${window.location.origin}/activate-company/${response.data }&name=${formData.FullName}`, {
                method: "GET",
            });
            responseMail.json().then((res) => {
                setLoading(false)
            }).catch((e) => {
                setLoading(false)
            })
            toast.success('Ditt konto har skapats')
            onClose(true    , false)
            setLoading(false)
        } else {
            toast.error('Ett konto finns redan med denna emailadress.')
            setLoading(false)
        }
        /*firebase.collection("tblUser").where("Email", "==", emailId).get()
            .then(function (querySnapshot) {
                if (querySnapshot.empty) {
                    setFormData(initialState)
                    firebase.collection("tblUser").add({
                        Email: emailId,
                        UserName: emailId,
                        PostCode: formData.PostCode,
                        Name: '',
                        Password: formData.Password,
                        UserType: 'company',
                        FullName: formData.FullName,
                        AboutUs: "",
                        ProfileImage: "",
                        OrganizationNo: formData.OrganizationNumber,
                        Address: formData.Address,
                        CompanyName: formData.CompanyName,
                        telephone: formData.telephone,
                        IsActivated: false,
                        IsLogin: false,
                        LoginIp: ""
                    }).then(async (res) => {
                        let response = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${emailId}&emailName=newuserregistercompany&docId=${window.location.origin}/activate-company/${res.id}&name=${formData.FullName}`, {
                            method: "GET",
                        });
                        response.json().then((res) => {
                            console.log("res", res)
                        }).catch((e) => {
                            console.log("e", e)
                        })
                        setLoading(false)
                        onClose(false, true)
                        toast.success('User register successfully')
                    })
                } else {
                    toast.error('Email already register Please enter different email')
                    setLoading(false)
                }
            })
            .catch(function (error) {
                console.error("Error getting documents: ", error);
            });*/
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "FullName":
                if (!value || value.trim() === "") {
                    return "Vänligen ange fullständigt namn";
                } else {
                    return "";
                }
            case "Address":
                if (!value || value.trim() === "") {
                    return "Address is required";
                } else {
                    return "";
                }
            case "Password":
                if (!value || value.trim() === "") {
                    return "Vänligen ange lösenord";
                } else {
                    return "";
                }
            case "ConfirmPassword":
                if (!value) {
                    return "Vänligen bekräfta ditt lösenord";
                } else if (value !== formData.Password) {
                    return "Nytt lösenord och bekräfta lösenord måste vara samma";
                } else {
                    return "";
                }
            case "OrganizationNumber":
                if (!value) {
                    return "Vänligen ange organisationsnummer";
                } else {
                    return "";
                }
            case "CompanyName":
                if (!value) {
                    return "Vänligen ange företagsnamn";
                } else {
                    return "";
                }
            case "telephone":
                if (!value) {
                    return "Telefonnummer krävs";
                } else {
                    return "";
                }
            case "Email":
                if (!value || value.trim() === "") {
                    return "Vänligen ange e-mailadress";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Ange en giltig e-postadress";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target
        if (name === "telephone" || name === "OrganizationNumber") {
            const re = /^[0-9\b]+$/;
            if (value === '' || re.test(value)) {
                setFormData(formData => ({
                    ...formData,
                    [name]: value
                }));
            }
        } else {
            setFormData(formData => ({
                ...formData,
                [name]: value
            }));
        }
    }

    return (
        <Modal show={isRegisterModal}
               size="lg"
               onHide={()=>onClose(false, false)}
               className="signin-signup-popup not-centred register-modal"
               aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="banner_form_title">
                        <h3>{window.location.pathname === "/company/register" ? 'Välkommen! Skapa ditt konto för att fortsätta.' : 'Välkommen! Skapa ditt konto för att fortsätta.'}</h3>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="col-12 p-0">
                    <div className="banner_form_main">
                        <div className="banner_form ">
                            <div className="banner_form_inner">
                                <div id="emailMsg"/>
                                <form id="emailFrom" method="post">
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="FullName"
                                                id="FullName"
                                                value={formData.FullName}
                                                onChange={handleInputChange}
                                                aria-describedby="emailHelp"
                                                placeholder="Fullständigt namn"
                                            />
                                            {formError.FullName && <p className="text-danger">{formError.FullName}</p>}
                                        </div>
                                        {/*<div className="form-group col-md-6">*/}
                                        {/*    <input*/}
                                        {/*        value={formData.PostCode}*/}
                                        {/*        onChange={handleInputChange}*/}
                                        {/*        type="text"*/}
                                        {/*        className="form-control"*/}
                                        {/*        name="PostCode"*/}
                                        {/*        placeholder="PostCode"*/}
                                        {/*    />*/}
                                        {/*    {formError.PostCode && <p className="text-danger">{formError.PostCode}</p>}*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="Email"
                                                id="email"
                                                value={formData.Email}
                                                onChange={handleInputChange}
                                                aria-describedby="emailHelp"
                                                placeholder="Emailadress"
                                            />
                                            {formError.Email && <p className="text-danger">{formError.Email}</p>}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <input 
                                                className="form-control" 
                                                type="tel"
                                                id="telephone"
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleInputChange}
                                                placeholder="Telefonnummer"
                                            />
                                            {formError.telephone && <p className="text-danger">{formError.telephone}</p>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <input
                                                value={formData.Password}
                                                onChange={handleInputChange}
                                                onKeyPress={keyPressed}
                                                id="Password"
                                                type="password"
                                                className="form-control"
                                                name="Password"
                                                placeholder="Lösenord"
                                            />
                                            {formError.Password && <p className="text-danger">{formError.Password}</p>}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="ConfirmPassword"
                                                onChange={handleInputChange}
                                                value={formData.ConfirmPassword}
                                                placeholder="Bekräfta lösenord"
                                            />
                                            {formError.ConfirmPassword && <p className="text-danger">{formError.ConfirmPassword}</p>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <input 
                                                className="form-control" 
                                                type="text"
                                                name="CompanyName"
                                                value={formData.CompanyName}
                                                onChange={handleInputChange}
                                                placeholder="Företagsnamn"
                                            />
                                            {formError.CompanyName && <p className="text-danger">{formError.CompanyName}</p>}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <input 
                                                className="form-control" 
                                                type="text"
                                                name="OrganizationNumber"
                                                value={formData.OrganizationNumber}
                                                onChange={handleInputChange}
                                                placeholder="Organisations nummer"
                                            />
                                            {formError.OrganizationNumber && <p className="text-danger">{formError.OrganizationNumber}</p>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-12">
                                            <textarea
                                                value={formData.Address}
                                                onChange={handleInputChange}
                                                name="Address"
                                                id="kort_beskrivning"
                                                className="form-control"
                                                placeholder="Adress"
                                            />
                                        </div>
                                    </div>
                                    <button disabled={isLoading} onClick={!isLoading ? handleSubmit : null} type="submit" name="submit" className="btn btn-primary">
                                        {isLoading ? "Läser in..." : "Publicera" }
                                    </button>
                                    <span className="signin-signup">Har du redan ett konto? <a className="signup-text-signin" onClick={()=>onClose(true, false)}>Logga in</a></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
