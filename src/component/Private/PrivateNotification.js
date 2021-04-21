import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { isLoaded, withFirestore, useFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReadMoreAndLess from 'react-read-more-less';
import Dashboardheader from '../Layout/DashboardHeader';
import Dashboardsidebar from '../Layout/DashboardSideBar';
import Loader from "../CommonComponents/Loader";
import Slider from "react-slick";
import moment from "moment";
import * as actions from '../../redux/action/actions';
// import MessageController from "../Messagecontroller/MessageController";
// import $ from "jquery"
// import Account from "../SettingsAccount/Account";
import ModalsSlider from "../CommonComponents/ModalsSlider";

const PrivateNotification = ({ projectMaster }) => {
  const firebase = useFirestore();
  const dispatch = useDispatch();
  const [projectMasterList, setData] = useState([]);
  const [imageList, setImages] = useState([]);
  const [isOpenModal, setOpenModal] = useState(false);
  // const [isMessageController, setIsMessageController] = useState(false);
  const userId = localStorage.getItem('userId')
  React.useEffect(() => {
    dispatch(actions.setLoader(true));
    firebase.get({
      collection: 'tblProjectMaster',
      storeAs: 'projectMaster',
      orderBy: ['CreatedDate', "desc"],
    })
  }, [])

  React.useEffect(() => {
    if (projectMaster.length !== projectMasterList.length) {
      const data = projectMaster.map((item, i) => {
        let timeStemp = (item.CreatedDate && item.CreatedDate.seconds)
        return ({
          ...item,
          timeAgo: moment(new Date(timeStemp * 1000)).fromNow(true),
        })
      })
      dispatch(actions.setLoader(false));
      setData(data)
    } else {
      dispatch(actions.setLoader(false));
    }
  }, [projectMaster])

  if (!isLoaded(projectMaster)) {
    return <Loader />
  }
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  // const onOpenMessageController = () => {
  //   setIsMessageController(true)
  //   $('body').addClass('message-overlay')
  // }
  //
  // const onCloseMessageController = () => {
  //   setIsMessageController(false)
  //   $('body').removeClass('message-overlay')
  // }

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
    <div id="wrapper">
      <Dashboardheader/>
      <Dashboardsidebar/>
     {/* {isOpenModal && <ModalsSlider isOpenModal={isOpenModal} handleModal={handleModal} imageList={imageList} />}*/}
      <div id="page-wrapper" className={`menu-push`}>
        {/*<a id="messageBox" className="settingbtn" onClick={isMessageController ? onCloseMessageController : onOpenMessageController}>*/}
        {/*  <i className={isMessageController ? 'fas fa-times' : 'fas fa-cog'}/>*/}
        {/*</a>*/}
        <div className="container-fluid p-0">
          <div className="row jobboxlisting">
            {
              projectMasterList.map((item, ind) => {
                return (
                  <React.Fragment key={ind}>
                    {
                      item.UserId === userId ? <div className="col-md-4">
                        <div className="private_product_inner dashbord-private">
                          <h5>
                            <i className="fas fa-map-marker-alt"/>
                            {item.Location} {item.PostCode}
                            <span>{item.timeAgo}<i className="fas fa-cog"/></span>
                          </h5>
                          <div className="testimonials private-slider">
                            <Slider {...settings}>
                              {
                                (item && item.Files).map((x, i) => {
                                  return (
                                      <div className="testimonial_box" key={i}>
                                        <img src={x} className="img-fluid" alt={x} onClick={()=>handleModal(item.Files)}/>
                                      </div>
                                  )
                                })
                              }
                            </Slider>
                          </div>
                          <div className="content-box private-content-box">
                            <h4>
                              {item.Title}
                            </h4>
                            <p>
                              <ReadMoreAndLess
                                  className="read-more-content"
                                  wordLimit={17}
                                  readMoreText=" Mer"
                                  readLessText=" Lindre">
                                {item.description}
                              </ReadMoreAndLess>
                            </p>
                          </div>
                        </div>
                      </div> : null
                    }
                  </React.Fragment>
                )
              })
            }
          </div>
        </div>
      </div>
      {/*{*/}
      {/*  isMessageController &&   <MessageController*/}
      {/*      isMessageController={isMessageController}*/}
      {/*  />*/}
      {/*}*/}

    </div>
  );
};

export default compose(
  withFirestore,
  connect((state) => ({
    projectMaster: (state.firestore.ordered && state.firestore.ordered.projectMaster) || [],
  }))
)(PrivateNotification)
