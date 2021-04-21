import React, {useState} from "react";
import Modal from 'react-bootstrap/Modal'
import images from "../../utils/ImageHelper";
import Slider from "react-slick";
import ModalsSlider from "./ModalsSlider";

const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
};

export default function ProfileView(props) {
    const [isOpenModal, setOpenModal] = useState(false);
    const [imageList, setImages] = useState([]);

    const userDetails = (props && props.profileDetails) || {}
    const projectDetails = (props && props.projectDetails) || {}

    const handleModal = (img) =>{
        if(Array.isArray(img)){
            setImages(img)
            setOpenModal(true)
        }else {
            setImages([])
            setOpenModal(false)
        }
    }

    return (
        <React.Fragment>
          {/*  {isOpenModal && <ModalsSlider isOpenModal={isOpenModal} handleModal={handleModal} imageList={imageList} />}*/}
            <Modal
                className="profile-details-modal"
                show={props.isOpenModal}
                onHide={() => props.closeModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Kunduppgifter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wi-100 pd-info">
                        <div className="wi-100 pd-info-box">
                            <img src={(userDetails && userDetails.ProfileImage) || images.avatarImg} alt={userDetails && userDetails.userName}/>
                            <ul className="pd-user-info">
                                <li><span className="pd-title">Namn: </span>{userDetails.FullName}</li>
                                <li><span className="pd-title">Email: </span>{userDetails.Email}</li>
                                <li><span className="pd-title">Telefon: </span>{userDetails.Phone}</li>
                            </ul>
                        </div>
                        <p><span className="pd-title">Om: </span>{userDetails.AboutUs}</p>
                        {
                            userDetails.OrganizationNo &&
                            <p><span className="pd-title">Organisations nr: </span>{userDetails.OrganizationNo}</p>
                        }

                        <div className="wi-100 pd-project-info">
                            <div className="job-title h4">Uppdraget:</div>
                            <p><span className="pd-title">Titel: </span>{projectDetails.Title || '-'}</p>
                            <p><span className="pd-title">Beskrivning: </span>{projectDetails.Description || '-'}</p>
                            {
                                (projectDetails.Files && projectDetails.Files.length) > 0 &&
                                <div className="pd-info-slider">
                                    <Slider {...settings}>
                                        {
                                            (projectDetails.Files && projectDetails.Files.length) > 0 ?
                                                projectDetails.Files.map((img, ind) => {
                                                    return(
                                                        <div key={ind}>
                                                            <img src={img} alt={ind} onClick={()=>handleModal(projectDetails.Files)}/>
                                                        </div>
                                                    )
                                                }) : <img alt="img" src={(projectDetails.Files && projectDetails.Files[0])}/>
                                        }
                                    </Slider>
                                </div>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}