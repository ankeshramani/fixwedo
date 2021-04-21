import React, { useState } from "react";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { Link, useHistory } from "react-router-dom";
import images from "../../utils/ImageHelper";
import Footer from "../Layout/Footer";
import '../../assets/css/slick-theme.css';
import '../../assets/css/slick.css';
import '../../assets/css/bootstrap.min.css';
//import '../../assets/css/bootstrap-grid.min.css';
import '../../assets/css/style.css';
import Slider from "react-slick";
import { toast } from "react-toastify";
import Login from "../Auth/Login/Login";
import CompanyRegister from "../Company/CompanyRegister";
import ForgotPassword from "../Auth/ForgotPassword";
import $ from "jquery";

const initialState = {
  description: "",
  postCode: "",
  email: "",
  title: "",
  files: []
}

export default function Home() {
  const firebase = useFirestore();
  const firebaseStorage = useFirebase();
  const [formData, setFormData] = useState(initialState);
  const [formError, setErrors] = useState(initialState);
  const [isLoginModal, setOpenLoginModal] = useState(false);
  const [isRegisterModal, setOpenRegisterModal] = useState(false);
  const [isShowForgotModal, setOpenForgotModal] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
  let history = useHistory();
  React.useEffect(() => {
    let src = `//code.tidio.co/f5r4orp8oauizt5gqbxrfiv0v64xqtuu.js`;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.id = "tidiochat";
    document.head.appendChild(script);
  }, []);

  // React.useEffect(() => {
  //   return () => {
  //     $("#tidiochat").remove();
  //     $("#tidio-chat").remove();
  //   };
  // });

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
    console.log(formData.email);
    const emailId = formData.email && formData.email.toLowerCase()
    firebase.collection("tblUser").where("Email", "==", emailId).get()
      .then(function (querySnapshot) {
        if (querySnapshot.empty) {
          setFormData(initialState)
          firebase.collection("tblUser").add({
            Email: emailId,
            UserName: formData.email,
            PostCode: formData.postCode,
            Name: '',
            telephone: '',
            Password: '',
            UserType: 'private',
            FullName: "",
            AboutUs: "",
            ProfileImage: "",
            OrganizationNo: "",
            Address: "",
            IsActivated: false,
            IsLogin: false,
            LoginIp: "",
            CompanyName: ''
          }).then(async docRef => {
            let response = await fetch(`${process.env.REACT_APP_API_SENDMAIL}?dest=${emailId}&emailName=newuserregister&docId=${window.location.origin}/create-password/${docRef.id}`, {
              method: "GET",
            });
            response.json().then((res) => {
              console.log("res", res)
            }).catch((e) => {
              console.log("e", e)
            })
            let imageList = [];
            (formData.files || []).forEach((x) => {
              const storageRef = firebaseStorage.storage().ref(`image`);
              const mainImage = storageRef.child(x.name);
              mainImage.put(x).then((snapshot) => {
                mainImage.getDownloadURL().then((url) => {
                  imageList.push(url);
                  if ((formData.files && formData.files.length) === (imageList && imageList.length)) {
                    firebase.collection("tblProjectMaster").add({
                      UserId: docRef.id,
                      description: formData.description,
                      Title: formData.title,
                      PostCode: formData.postCode,
                      Files: imageList,
                      CreatedDate: new Date(),
                      UpdatedDate: new Date(),
                      UpdatedBy: docRef.id,
                    }).then((result) => {
                      setFormData(formData => ({
                        ...formData,
                        description: '',
                        title: '',
                        location: '',
                        files: [],
                      }));
                      toast.success("Record create successfully");
                    }).catch((error) => {
                      toast.error("Something went wrong please try again");
                    });
                  }
                })
              })
            })

          }).catch((error) => {
            toast.error("Something went wrong please try again");
          });
        } else {
          let imageList = []
          querySnapshot.forEach(function (doc) {
            const data = doc.data();
            if (data.Email === emailId) {
              (formData.files || []).forEach((x) => {
                const storageRef = firebaseStorage.storage().ref(`image`);
                const mainImage = storageRef.child(x.name);
                mainImage.put(x).then((snapshot) => {
                  mainImage.getDownloadURL().then((url) => {
                    imageList.push(url);
                    if ((formData.files && formData.files.length) === (imageList && imageList.length)) {
                      firebase.collection("tblProjectMaster").add({
                        description: formData.description,
                        Title: formData.title,
                        Files: imageList,
                        PostCode: formData.postCode,
                        CreatedDate: new Date(),
                        UpdatedDate: new Date(),
                        UpdatedBy: querySnapshot.docs[0].id,
                        UserId: querySnapshot.docs[0].id,
                      }).then((result) => {
                        setFormData(formData => ({
                          ...formData,
                          description: '',
                          title: '',
                          location: '',
                          files: [],
                        }));
                        toast.success("Record create successfully");
                      }).catch((error) => {
                        toast.error("Something went wrong please try again");
                      });
                    }
                  })
                })
              })
              setFormData(initialState)
            }
          });
        }
      })
      .catch(function (error) {
        console.error("Error getting documents: ", error);
      });
    // window.location = "/Dashboard";
  };

  const formValidate = (name, value) => {
    switch (name) {
      case "description":
        if (!value || value.trim() === "") {
          return "Description is required";
        } else {
          return "";
        }
      case "postCode":
        if (!value || value.trim() === "") {
          return "Post code is required";
        } else {
          return "";
        }
      case "title":
        if (!value || value.trim() === "") {
          return "Title is required";
        } else {
          return "";
        }
      case "email":
        if (!value || value.trim() === "") {
          return "Email is required";
        } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
          return "Enter a valid email address";
        } else {
          return "";
        }
      default: {
        return "";
      }
    }
  };

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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === "postCode") {
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
    setErrors(formError => ({
      ...formError,
      [name]: formValidate(name, value)
    }));
  }

  const handleLoginModal = (login, signup) => {
    setOpenLoginModal(login)
    setOpenRegisterModal(signup)
  }

  const handleLoginRegister = (login, signup) => {
    setOpenLoginModal(login)
    setOpenRegisterModal(signup)
  }

  const logout = () => {
    firebase.collection("tblUser").doc(userInfo.id).set({
      ...userInfo,
      IsLogin: false,
    }).then((res) => {
      window.location.reload()
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");
    }).catch((e) => {
    })
  }

  const settings = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    dots: true,
  };

  const handleForgot = () =>{
    setOpenForgotModal(true)
    setOpenLoginModal(false)
  }

  const onRedirect = (url) => {
    window.location.replace(url)
    //history.push(url)
  }

 // console.log("111",userInfo)
 // const userType = (userInfo && userInfo.UserType)
  return (
    <div className="App homescroll" id="tidiochat">
      {/*<header id="header" className="header_main">*/}
      {/*  <div className="container">*/}
      {/*    <div className="row">*/}
      {/*      <nav className="navbar navbar-expand-lg navbar-light bg-light">*/}
      {/*        <a className="navbar-brand" href="#top">*/}
      {/*          <img src={images.logosvg} alt="logo-img" />*/}
      {/*        </a>*/}
      {/*      </nav>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</header>*/}


      <div className="password_header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-sm-2 col-10">
              <div className="password_header_logo">
                <a><img alt="img" src={images.logosvg} /></a>
              </div>
            </div>
            <div className="col-sm-10 col-10">
              <div className="header_menu">
                {
                  userInfo.id ?
                    <ul>
                      <li><a href="/get-help">Publicera ett jobb</a></li>
                      <li onClick={() => onRedirect('/job-list')}><a>Uppdrag</a></li>
                      <li onClick={() => onRedirect('/company/dashboard')}><a>Välkommen {userInfo.FullName}</a></li>
                      <li><a onClick={logout}>Logga ut</a></li>
                    </ul> :
                    <ul>
                      <li><a href="/get-help">Publicera ett jobb</a></li>
                      <li onClick={() => onRedirect('/job-list')}><a>Uppdrag</a></li>
                      <li onClick={() => handleLoginModal(true, false)}><a>LOGGA IN</a></li>
                      <li onClick={() => handleLoginRegister(false, true)}><a>ANSLUT FORETAG</a></li>
                    </ul>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        isLoginModal && <Login isModalOpen={isLoginModal} onClose={handleLoginModal} onForgotPassword={handleForgot}/>
      }
      {
        isRegisterModal && <CompanyRegister isRegisterModal={isRegisterModal} onClose={handleLoginRegister} />
      }
      {
        isShowForgotModal && <ForgotPassword open={isShowForgotModal} onClose={()=>setOpenForgotModal(false)} />
      }
      <div className="banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="banner_text">
                <div className="banner_text_inner">
                  <span className="banner_star_text">
                    <img src={images.bannerStar} alt="banner" />
                    SVAR SAMMA DAG
                  </span>
                  <h2>Anlita trädgårdsproffs nära dig</h2>
                  <p>
                    Behöver du hjälp med trädgårdsarbete? Fyll i formuläret så
                    matchar vi dig med trädgårdsproffs nära dig. Snabb, smidigt
                    & säkert!
                  </p>
                  <div className="banner_btn">
                    <a href="#top">
                      <img src={images.playIcon} alt="play" />
                    </a>
                    <span>SE VÅR FILM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="banner_form_main">
                <div className="banner_form dn">
                  <div className="banner_form_title">
                    <h3>BOKA TRÄDGÅRDSPROFFS IDAG</h3>
                    <p>
                      Fyll i formuläret och din förfrågan kopplas till relevanta
                      företag nära dig
                    </p>
                  </div>
                  <div className="banner_form_inner">
                    <div id="emailMsg"></div>
                    <form id="emailFrom" method="post">
                      <div className="form-group">
                        <label>Postnummer</label>
                        <input
                          value={formData.postCode}
                          onChange={handleInputChange}
                          type="text"
                          className="form-control"
                          name="postCode"
                          id="postnummer"
                          aria-describedby="emailHelp"
                          placeholder="Postnummer"
                        />
                        {formError.postCode && <p className="text-danger">{formError.postCode}</p>}
                      </div>
                      <div className="form-group">
                        <label>Rubrik</label>
                        <input
                          value={formData.title}
                          onChange={handleInputChange}
                          name="title"
                          id="kort_beskrivning"
                          className="form-control"
                          placeholder="Rubrik"
                        />
                        {formError.title && <p className="text-danger">{formError.title}</p>}
                      </div>
                      <div className="form-group">
                        <label>Kort beskrivning</label>
                        <textarea
                          value={formData.description}
                          onChange={handleInputChange}
                          name="description"
                          id="kort_beskrivning"
                          className="form-control"
                          placeholder="Kort beskrivning"
                        />
                        {formError.description && <p className="text-danger">{formError.description}</p>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="Email">Email</label>
                        <input
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          aria-describedby="emailHelp"
                          placeholder="Email"
                        />
                        {formError.email && <p className="text-danger">{formError.email}</p>}
                      </div>
                      <div className="form-group choose_file">
                        <label>Ladda upp bild</label>
                        <div className="inputfileupload"><input
                          onChange={imageUpload}
                          accept="image/*"
                          name="files"
                          type="file"
                          multiple
                        />
                          <div>
                            <p><span>
                              Ladda upp fil
                              </span>
                              Ingen fil vald</p>
                          </div>
                        </div>
                        <div id="result">
                          <Slider {...settings}>
                            {
                              (formData.files || []).map((x, i) => {
                                let url = URL.createObjectURL(x)
                                return (
                                  <div className="img-inner" key={i}>
                                    <a onClick={() => onRemoveImage(x, i)}>x</a>
                                    <img src={url} className="thumbnail" alt={url} />
                                  </div>
                                )
                              })
                            }
                          </Slider>
                        </div>
                      </div>
                      <button
                        onClick={handleSubmit}
                        type="submit"
                        name="submit"
                        className="btn btn-primary">
                        Publicera
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section_title">
                <h2>TRE FÖRDELAR MED FixWeDo</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <div className="services_box">
                <div className="services_icon">
                  <img src={images.services1} alt="services" />
                </div>
                <div className="services_text">
                  <h3>
                    <a href="#top">Få kontakt idag</a>
                  </h3>
                  <p>
                    Publicera ett jobb på 30 sekunder, och få kontakt med proffs
                    idag!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="services_box">
                <div className="services_icon">
                  <img src={images.services2} alt="services2" />
                </div>
                <div className="services_text">
                  <h3>
                    <a href="#top">Smidig kommunikation</a>
                  </h3>
                  <p>
                    Kommunicera direkt med dina hantverkare på smidigare sätt!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="services_box">
                <div className="services_icon">
                  <img src={images.services3} alt="services3" />
                </div>
                <div className="services_text">
                  <h3>
                    <a href="#top">Verifierade trädgårdsproffs</a>
                  </h3>
                  <p>
                    Med kontrollerade företag & ömsesidiga omdömen står trygghet
                    i fokus!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-work">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section_title">
                <h2 className="text-white">SÅ FUNGERAR DET</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 half_round_shape">
              <div className="how_it_box">
                <div className="how_it_num">
                  <span>1</span>
                </div>
                <div className="how_it_text">
                  <h3>
                    Publicera ditt <br></br>uppdrag
                  </h3>
                  <p>
                    Glöm krångliga formulär. Du publicerar ditt uppdrag på under
                    30 sekunder och får kontakt samma dag.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 half_round_shape">
              <div className="how_it_box">
                <div className="how_it_num">
                  <span>2</span>
                </div>
                <div className="how_it_text">
                  <h3>
                    Smidig <br></br> kommunikation
                  </h3>
                  <p>
                    Kommunikation som det borde vara. Red ut alla frågor på ett
                    smidigt sätt. Bestäm tid, plats & pris för jobbet.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 half_round_shape">
              <div className="how_it_box">
                <div className="how_it_num">
                  <span>3</span>
                </div>
                <div className="how_it_text">
                  <h3>Luta dig tillbaka & njut av väl utfört jobb</h3>
                  <p>
                    När jobbet är utfört och alla parter är nöjda betalas
                    pengarna ut till hantverkaren. Nu ges även möjlighet att ge
                    ett omdöme för jobbet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section_title d-lg-none d-md-none d-sm-block">
                <h2 className="text-center">
                  Publicera och hantera dina uppdrag ännu enklare i FixWeDo appen.
                  Kommer snart!
                </h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="mobile_img">
                <img src={images.phoneImg} alt="phone_img" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="section_title app-title-responsive">
                <h2 className="text-left">
                  Publicera och hantera dina uppdrag ännu enklare<br></br> i
                  FixWeDo appen.<br></br> Kommer snart!
                </h2>
              </div>
              <div className="app_icon">
                <a href="#top">
                  <img src={images.appstoreBtn} alt="appstoreBtn" />
                </a>
                <a href="#top">
                  <img src={images.googlePlayIcon} alt="googlePlayIcon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
