import React, { useState } from "react";

import * as actions from '../../../redux/action/actions';
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import {ApiService} from "../../../ApiService";

const initialState = {
    email: "",
    password: "",
}

export default function Login({isModalOpen, onClose, onForgotPassword, ...props}) {
    let apiService = new ApiService()
    const [formData, setFormData] = useState(initialState)
    const [error, setErrors] = useState(initialState);
    const [isLoading, setLoading] = useState(false);


    const keyPressed = (target) => {
        if (target.charCode === 13) {
            signInWithEmail()
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "email":
                if (!value || value.trim() === "") {
                    return "Vänligen ange emailadress";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Vänligen ange emailadress";
                } else {
                    return "";
                }

            case "password":
                if (!value) {
                    return "Vänligen ange lösenord";
                } else {
                    return "";
                }

            default: {
                return "";
            }
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        const { name, value } = event.target
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
        setErrors(error => ({
            ...error,
            [name]: formValidate(name, value)
        }));
    }

    const signInWithEmail = async () => {
        setLoading(true)
        const { email, password } = formData;
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
        const emailId = email && email.toLowerCase()
        const payload = {
            emailId: emailId,
            password: password
        }
        const response = await apiService.login(payload)
        if(response.status) {
            localStorage.setItem('userDetails', JSON.stringify(response.data))
            localStorage.setItem('userId', response.data.id)
            toast.success('Du har loggats in')
            setLoading(false)
            onClose()
            window.location.reload()
        } else {
            setLoading(false)
            toast.error(response.data)
            toast.error(response.message)
        }

        /*firebaseStore.collection("tblUser").where("Email", "==", emailId).where("Password", "==", password).get().then(function (querySnapshot) {
            if (!querySnapshot.empty) {
                querySnapshot.forEach( async(doc) =>  {
                    const data = doc.data();
                    if(data.IsActivated) {
                        if (data.Email === emailId) {
                            localStorage.setItem('userDetails', JSON.stringify(data))
                            localStorage.setItem('userId', doc.id)
                            let response = await fetch(`${process.env.REACT_APP_API_IPADDRESS}`, {
                                method: "GET",
                            });
                            response.json().then((res)=>{
                                firebaseStore.collection("tblUser").doc(doc.id).set({
                                    ...data,
                                    IsLogin: true,
                                    LoginIp: res.ipAddress
                                }).then((res) => {
                                    if (data.UserType === "company") {
                                        window.location.replace('/company/dashboard')
                                    }
                                    if(data.UserType === "private"){
                                        window.location.replace('/dashboard')
                                    }
                                    setLoading(false)
                                }).catch((e) => {

                                    setLoading(false)
                                })
                            }).catch((e) => {
                                setLoading(false)
                            })

                            setLoading(false)
                        } else {
                            setLoading(false)
                            toast.error("User not Found");
                        }
                    } else {
                        setLoading(false)
                        toast.error("Activate your account then after login");
                    }
                });
            } else {
                setLoading(false)
                toast.error("User not Found");
            }
        }).catch(function (error) {
            setLoading(false)
        })*/
    }

    return (
        <Modal show={isModalOpen}
               size="lg"
               onHide={()=>onClose(false, false)}
               className="signin-signup-popup not-centred"
               aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="banner_form_title">
                        <h3>Välkommen tillbaka! logga in för att fortsätta.</h3>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <div className="col-12 p-0">
                <div className="banner_form_main">
                    <div className="banner_form">
                        <div className="banner_form_inner">
                            <div id="emailMsg"/>
                            <form id="emailFrom" method="post">
                                <div className="form-group">
                                    <input
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder="Emailadress"
                                    />
                                    {error.email && <p className="text-danger">{error.email}</p>}
                                </div>
                                <div className="form-group">
                                    <input name="password" type="password"
                                           value={formData.password}
                                           onChange={handleInputChange}
                                           id="kort_beskrivning"
                                           className="form-control"
                                           placeholder="Lösenord"
                                           onKeyPress={keyPressed}
                                    />
                                    {error.password && <p className="text-danger">{error.password}</p>}
                                </div>
                                <div className="form-group ">
                                    <div className="form-inline">
                                        <div className="custom-control custom-checkbox">
                                            <input className="custom-control-input" type="checkbox" id="remCheck" name="remember"/>
                                            <label className="custom-control-label" htmlFor="remCheck">Kom ihåg mig</label>
                                        </div>
                                     <a className="forgot-pass" onClick={onForgotPassword}>Glömt lösenord?</a>
                                    </div>
                                </div>
                                {isLoading && <button disabled={isLoading} type="button" name="submit" className="btn">Läser in....</button>}
                                {
                                    !isLoading &&
                                    <button disabled={isLoading} onClick={signInWithEmail} type="button" name="submit" className="btn">
                                      Login
                                    </button>
                                }
                                {/*{loginError && <p className="text-danger">{loginError}</p>}*/}
                                <span className="signin-signup">Har du inget konto? <a className="signup-text-signin" onClick={()=>onClose(false, true)}>Skapa nytt</a></span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </Modal.Body>
        </Modal>
    )
}