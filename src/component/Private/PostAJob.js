import React, { useState, useEffect } from "react";
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import Dashboardsidebar from '../Layout/DashboardSideBar';
import { loadExternalScript } from "../../utils/utility";
import { toast } from "react-toastify";
import images from "../../utils/ImageHelper";
import { useFirestore, useFirebase } from "react-redux-firebase";
import Slider from "react-slick";
/*import MessageController from "../Messagecontroller/MessageController";*/
import $ from "jquery"
import * as actions from "../../redux/action/actions";
import {useDispatch} from "react-redux";


const initialState = {
    description: "",
    postCode: "",
    email: "",
    title: "",
    location: "",
    files: [],
    titleCount: 0
}
const PostAJob = () => {
    useEffect(() => {
        let src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB6J4Y-lNpNQ-ijDqoVs1fINklycWCtnA4&types=geocode&libraries=places`;
        let id = "googleapi";
        loadExternalScript({ src, id });
    }, []);
    const dispatch = useDispatch();
    const firebase = useFirestore();
    const firebaseStorage = useFirebase();
    const [formData, setFormData] = useState(initialState);
    const [formError, setErrors] = useState(initialState);
    const [isMessageController, setIsMessageController] = useState(false);
    const UserId = localStorage.getItem('userId')

    const onOpenMessageController = () => {
        setIsMessageController(true)
        $('body').addClass('message-overlay')
    }

    const onCloseMessageController = () => {
        setIsMessageController(false)
        $('body').removeClass('message-overlay')
    }
    const changeState = (e) => {
        e.preventDefault();
        var input = document.getElementById("locality");
        var options = {};
        var autocomplete = new window.google.maps.places.Autocomplete(
            input,
            options
        );
        window.google.maps.event.addListener(
            autocomplete,
            "place_changed",
            function () {
                var place = autocomplete.getPlace();
                var lat = place.geometry && place.geometry.location.lat();
                var lng = place.geometry && place.geometry.location.lng();

                const locationInfo = {
                    latitude: lat || "",
                    longitude: lng || "",
                    placeId: (place && place.place_id) || "",
                    address: (place && place.formatted_address) || ""
                };
                setFormData(formData => ({
                    ...formData,
                    location: locationInfo.address
                }));
               // console.log("?????????locationInfo", locationInfo);
            }
        );
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
                } else {
                    return "";
                }
            case "location":
                if (!value || value.trim() === "") {
                    return "Search location is required";
                } else {
                    return "";
                }
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData(formData => ({
            ...formData,
            [name]: value,
        }));
        setErrors(formError => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
    }

    const handleSubmit = (e) => {
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
        dispatch(actions.setLoader(true));
        let imageList = [];
        if(formData.files.length){
            (formData.files || []).forEach((x, i) => {
                const storageRef = firebaseStorage.storage().ref(`image`);
                const mainImage = storageRef.child(x.name);
                mainImage.put(x).then((snapshot) => {
                    mainImage.getDownloadURL().then((url) => {
                        imageList.push(url);
                        if ((formData.files && formData.files.length) === (imageList && imageList.length)) {
                            postProject(imageList)
                        }
                    })
                })
            })
        }else {
            postProject([])
        }
    }

    const postProject = (imageList) =>{
        firebase.collection("tblProjectMaster").add({
            UserId: UserId,
            description: formData.description,
            Title: formData.title,
            PostCode: '',
            Location: formData.location,
            Files: imageList,
            CreatedDate: new Date(),
            UpdatedDate: new Date(),
            UpdatedBy: UserId,
            ProjectStatus: ''
        }).then((result) => {
            setFormData(formData => ({
                ...formData,
                description: '',
                title: '',
                location: '',
                files: [],
            }));
            dispatch(actions.setLoader(false));
            toast.success("Uppdraget publicerades");
        }).catch((error) => {
            dispatch(actions.setLoader(false));
            toast.error("Something went wrong please try again");
        })
    }

    const imageUpload = (event) => {
        const data = [...formData.files, ...event.target.files]
        setFormData(formData => ({
            ...formData,
            files: data
        }));
    }
    const onRemoveImage = (x) => {
        const index = formData.files.findIndex((y) => y.name === x.name)
        formData.files.splice(index, 1)
        setFormData(formData => ({
            ...formData,
        }));
    }
    const settings = {
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 3,
        arrows: true,
        dots: true,
        responsive: [
            {
              breakpoint: 1367,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 3,
                arrows: true,
                dots: true
              }
            },
            {
                breakpoint: 992,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3
                }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 481,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
        ]
    };
    const titleCount = formData.title.length > 0 ? formData.title.length : 0;
    return (
        <div id="wrapper">
            <Dashboardheader></Dashboardheader>
            <Dashboardsidebar></Dashboardsidebar>
            <div id="page-wrapper" className={`menu-push ${isMessageController ? 'active' : ''} `}>
                {/*<a id="messageBox" className="settingbtn" onClick={isMessageController ? onCloseMessageController : onOpenMessageController}>*/}
                {/*    <i className={isMessageController ? 'fas fa-times' : 'fas fa-cog'}></i>*/}
                {/*</a>*/}
                <div className="container-fluid p-0">
                    <div className="main-job-form">
                        <div className="row job-spacebox">
                            <div className="col-md-6">
                                <div className="job-inputbox">
                                    <input type="text" name="title" value={formData.title} maxLength="140" id="text" placeholder="Ange titel" onChange={handleInputChange} />
                                    <div className="word_count">
                                        <span id="count">{titleCount}</span><span>/140</span>
                                    </div>
                                    {formError.title && <p className="text-danger">{formError.title}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="job-inputbox job-mapicon">
                                    <i className="fas fa-map-marker-alt"/>
                                     <input id="locality" name="query" onChange={changeState}/>
                                   {/* <input id="location" name="location" value={formData.location} onChange={handleInputChange} />*/}
                                    {formError.location && <p className="text-danger">{formError.location}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="job-textbox">
                                    <textarea placeholder="Beskriv ditt uppdrag" name="description" value={formData.description} onChange={handleInputChange}></textarea>
                                    {formError.description && <p className="text-danger">{formError.description}</p>}
                                </div>
                            </div>
                        </div>

                        {formData.files && formData.files.length ? <div className="form-sliderbox">
                            <Slider {...settings}>
                                {
                                    (formData.files || []).map((x, i) => {
                                        let url = URL.createObjectURL(x)
                                        return (
                                            <div className="sliderbox" key={i}>
                                                <a onClick={() => onRemoveImage(x, i)}>x</a>
                                                <img src={url} className="img-box" alt={url} />
                                            </div>
                                        )
                                    })
                                }
                            </Slider>

                        </div> : null}
                        <div className="main_uplode_inner_wrapper">
                            <input className="uplode_input_type" onChange={imageUpload} accept="image/*" id="files" name="files" type="file" multiple />
                            <div className="middle_section">
                                <div className="middle_contant">
                                    <i className="fas fa-image"></i>
                                    <h3>Ladda upp foto</h3>
                                </div>
                            </div>
                        </div>

                        <div className="postjob-btnbox" >
                            <button onClick={handleSubmit} style={{ padding: 0, border: 0, width: "100%", }}><a>Publicera uppdrag</a></button>
                        </div>
                    </div>
                </div>
            </div>
            {/*<MessageController isMessageController={isMessageController}/>*/}
        </div>
    );
}
export default PostAJob;