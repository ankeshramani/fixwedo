import React, {useState} from "react";
import { useFirestore} from 'react-redux-firebase'
import Modal from "react-bootstrap/Modal";
import images from "../../utils/ImageHelper";
import {toast} from "react-toastify";
import { useHistory } from "react-router-dom";
import {ApiService} from "../../ApiService";

const initialState = {
    confirmPassword: "",
    password: "",
    email: ''
}

export default function ForgotPassword({open, onClose}) {
    const firebaseStore = useFirestore();
    const [formData, setFormData] = useState(initialState)
    const [isLoading, setLoading] = useState(false);
    const [formError, setErrors] = useState(initialState);
    let apiService = new ApiService()

    const handleInputChange = (event) => {
        event.persist();
        const {name, value} = event.target
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    }
    const formValidate = (name, value) => {
        switch (name) {
            case "email":
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
    const handelForgotPassword =async (e) =>{
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
        const { email } = formData;
        if(email){
            const emailId = email && email.toLowerCase()
            setLoading(true)
            const res = await apiService.forgotPasswordCheckEmail(email)
            if(res.status === true){
                let response = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${emailId}&emailName=ForgotPassword&docId=${window.location.origin}/forget-password/${res.data.id}&name=${res.data.FullName}`, {
                    method: "GET",
                });
                if(response.status === 200){
                    toast.success("Skicka din e-postadress")
                    onClose()
                } else {
                    toast.error("Something went wrong please try again")
                }
            } else {
                toast.error("Something went wrong please try again")
                setLoading(false)
            }


            /*firebaseStore.collection("tblUser").where("Email", "==", emailId).get().then(function (querySnapshot) {
                if(!querySnapshot.empty){
                    querySnapshot.forEach( async(doc) =>  {
                        const data = doc.data();
                        let response = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${emailId}&emailName=ForgotPassword&docId=${window.location.origin}/forget-password/${data.id}&name=${data.FullName}`, {
                            method: "GET",
                        });
                        if(response.status === 200){
                            toast.success("Send mail your E-mail address")
                            onClose()
                        } else {
                            toast.error("Something went wrong please try again")
                        }
                        setLoading(false)
                    })
                } else {
                    toast.error("This email is not registered")
                    setLoading(false)
                }
            })*/
        }
    }

    const keyPressed = (target) => {
        if (target.charCode === 13) {
            handelForgotPassword()
        }
    }

    return (
        <Modal show={open} onHide={onClose} size="lg" className="signin-signup-popup" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="banner_form_title">
                        <h3>Glömt ditt lösenord?</h3>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="banner_form_inner">
                    <div className="forgetpopup-title">
                        <h3>Oroa dig inte! Fyll bara i din e-post och <br/>Vi skickar en länk för att återställa ditt lösenord.</h3>
                    </div>
                    <form id="emailFrom" method="post">
                        <div className="form-group">

                            <div className="form-group">
                                <input
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    id="email"
                                    aria-describedby="emailHelp"
                                    placeholder="Email"
                                    onKeyPress={keyPressed}
                                />
                                 {formError.email && <p className="text-danger">{formError.email}</p>}
                            </div>
                        </div>
                        {
                            isLoading ?
                                <button type="button" name="submit" className="btn btn-primary">
                                   Läser in
                                </button> :
                                <button onClick={handelForgotPassword} type="button" name="submit" className="btn btn-primary">
                                    Återställ lösenord
                                </button>
                        }
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}