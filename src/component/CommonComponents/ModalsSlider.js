import React from "react";
import Modal from 'react-bootstrap/Modal'
import Carousel from 'react-bootstrap/Carousel'
import ReadMoreAndLess from "react-read-more-less";
import images from "../../utils/ImageHelper";

export default function ModalsSlider(props) {
    const img = (props.selectedRecord && props.selectedRecord.Files && props.selectedRecord.Files.length)

    return (
        <Modal
            show={props.isOpenModal}
            onHide={() => props.handleModal()}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                {
                    img > 1 &&
                    <Carousel>
                        {
                            props.selectedRecord && props.selectedRecord.Files.map((img, ind) =>{
                                return(
                                    <Carousel.Item key={ind}>
                                        <img className="d-block w-100" src={img === "no_image" ?  images.slide1 : img} alt={`First slide ${ind}`} />
                                    </Carousel.Item>
                                )
                            })
                        }
                    </Carousel>
                }
                {
                    img === 1 &&
                    <Carousel indicators={false} controls={false}>
                        <Carousel.Item>
                            <img className="d-block w-100" src={props.selectedRecord && props.selectedRecord.Files[0] === "no_image" ?  images.slide1 : props.selectedRecord && props.selectedRecord.Files[0]} alt={`First slide`}/>
                        </Carousel.Item>
                    </Carousel>
                }

                <h5>{(props.selectedRecord && props.selectedRecord && props.selectedRecord.email) || '-'}</h5>
                <h5>{(props.selectedRecord && props.selectedRecord && props.selectedRecord.telephone) || '-'}</h5>
                <h4> {props.selectedRecord && props.selectedRecord && props.selectedRecord.Title} </h4>
                <div className={"job_discripation"}>
                    <ReadMoreAndLess className="read-more-content" wordLimit={100} readMoreText=" Mer" readLessText=" Mindre">{props.selectedRecord && props.selectedRecord && props.selectedRecord.description}</ReadMoreAndLess>
                </div>
                <h5 className={`infolocation`}>
                    <i className="fas fa-map-marker-alt"/>
                    {props.selectedRecord && props.selectedRecord && props.selectedRecord.address}
                </h5>
            </Modal.Body>
        </Modal>
    );
}
