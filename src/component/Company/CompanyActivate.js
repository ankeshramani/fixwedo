import React,{useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import {useFirestore} from "react-redux-firebase";
import {toast} from "react-toastify";
import {ApiService} from "../../ApiService";

const CompanyActivate = () =>  {
    const firebase = useFirestore();
    const userId = (window.location && window.location.pathname && window.location.pathname.split("/")[2])
    let apiService = new ApiService()

    useEffect(() => {
        activateCompanyAccount()
    },[]);

    const activateCompanyAccount =async () => {
        const res = await apiService.activateCompanyAccount(userId)
    }
    /*React.useEffect(()=>{
        firebase.collection("tblUser").doc(userId).get().then(function (querySnapshot) {
            if (querySnapshot.exists) {
                const data = querySnapshot.data();
                console.log(data)
                firebase.collection("tblUser").doc(userId).set({
                    ...data,
                    IsActivated: true
                }).then((doc) => {
                }).catch(error => {

                });

            } else {
                console.error("No such document!");
            }
        }).catch(function (error) {
            console.error("Error getting documents: ", error);
        });
    },[])*/

    return (
        <Modal show={true}
               size="sm"
               onHide={false}
               className="signin-signup-popup not-centred register-modal"
               aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                {/*<Modal.Title>
                    <div className="banner_form_title">
                        <h3>{window.location.pathname === "/company/register" ? 'Company Registration' : 'Välkommen,\n Sign Up to Continue.'}</h3>
                    </div>
                </Modal.Title>*/}
            </Modal.Header>

            <Modal.Body>
                <div className="col-12 p-0">
                    <div className="banner_form_main">
                        <div className="banner_form ">
                           <span>Thank you for register! <a href="/">click here</a> to login</span>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
export default CompanyActivate