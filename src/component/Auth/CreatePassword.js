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
}

export default function CreatePassword() {
    let history = useHistory();
    const [formData, setFormData] = useState(initialState)
    const [error, setErrors] = useState(initialState);
    const [isLoading, setLoading] = useState(false);
    const [activeUser, setActive] = React.useState({})

    const firebase = useFirestore();
    const userId = (window.location && window.location.pathname && window.location.pathname.split("/")[2])
    let apiService = new ApiService()

    /*React.useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
        if(userInfo.id === userId){
            if(userInfo.UserType === "private"){
                history.push("/dashboard")
            }else {
                history.push("/company/dashboard")
            }
        }
        firebase.collection("tblUser").doc(userId).get().then(function (querySnapshot) {
            if (querySnapshot.exists) {
                const data = querySnapshot.data();
                if(data){
                    data.id = querySnapshot.id
                    if(window.location.pathname.split("/")[1] === "create-password"){
                        if(data.IsActivated){
                            history.push("/")
                        }
                    }
                    setActive(data)
                }
            } else {
                console.error("No such document!");
            }
        }).catch(function (error) {
            console.error("Error getting documents: ", error);
        });
    },[])*/

    const formValidate = (name, value) => {
        switch (name) {
            case "password":
                if (!value) {
                    return "Password is Required";
                } else {
                    return "";
                }
            case "confirmPassword":
                if (!value) {
                    return "Confirm Password Required";
                } else if (value !== formData.password) {
                    return "New Password and Confirm Password Must be Same";
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
        const {name, value} = event.target
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    }

    const setPassword =async () => {

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
        const payload = {
            Password: formData.password,
        }
        const res = await apiService.forgetPassword(userId, payload)
        if(res.status === true){
            history.push("/")
            toast.success("Password updated successfully");
        } else {
            toast.error("Something went wrong please try again");
        }

       /* if(activeUser.id === userId){
            setLoading(true)
            setErrors({});
            firebase.collection("tblUser").doc(userId).set({
                ...activeUser,
                Password: formData.password,
                IsActivated: true
            }).then((doc) => {
                history.push("/")
                toast.success("Password updated successfully");
            }).catch(error => {
                setLoading(false)
                toast.error("Something went wrong please try again");
            });
        }else {
            toast.error("Something went wrong please try again");
        }*/
    }

    return (
        <div>
            <div className="banner">
                <div className="container">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="banner_form_main">
                                <div className="banner_form">
                                    <Modal show={true} size="lg" className="signin-signup-popup" aria-labelledby="contained-modal-title-vcenter" centered>

                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                <div className="banner_form_title">
                                                    <h3>Finalize your Account,<br></br>Choose a Password.</h3>
                                                </div>
                                            </Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>
                                            <div className="banner_form_inner">
                                            <form id="emailFrom" method="post">
                                               <div className="form-group">
                                                    <input
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        type="password"
                                                        className="form-control"
                                                        name="password"
                                                        id="password"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Password"
                                                    />
                                                    {error.password &&
                                                    <p className="text-danger">{error.password}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <input name="confirmPassword"
                                                           type="password"
                                                           value={formData.confirmPassword}
                                                           onChange={handleInputChange}
                                                           id="kort_beskrivning"
                                                           className="form-control"
                                                           placeholder="Confirm Password"
                                                    />
                                                    {error.confirmPassword &&
                                                    <p className="text-danger">{error.confirmPassword}</p>}
                                                </div>
                                                {
                                                    isLoading ?
                                                        <button type="button" name="submit" className="btn btn-primary">
                                                           Läser in...
                                                        </button> :
                                                        <button onClick={setPassword} type="button" name="submit" className="btn btn-primary">
                                                            Sign in
                                                        </button>
                                                }
                                                {/*{loginError && <p className="text-danger">{loginError}</p>}*/}
                                            </form>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}