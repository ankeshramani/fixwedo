import React, { Component } from "react";
import "./App.css";
import Home from "./component/Home/Home";
import { useSelector } from "react-redux";
import PrivateNotification from "./component/Private/PrivateNotification";
import Offers from "./component/Private/Offers";
import OffersAccepted from "./component/Private/OffersAccepted";
import OffersConfirmed from "./component/Private/OffersConfirmed";
import OffersAddExtra from "./component/Private/OffersAddExtra";
import OffersAddedExtra from "./component/Private/OffersAddedExtra";
import OffersCompleted from "./component/Private/OffersCompleted";
import OffersRate from "./component/Private/OffersRate";
import OffersNewOffer from "./component/Private/OffersNewOffer";
import PostAJob from "./component/Private/PostAJob";
import PostedJobs from "./component/Private/PostedJobs";
import SettingsAccount from "./component/SettingsAccount/SettingsAccount";



import CompanyDashboard from "./component/Company/CompanyDashboard";
import CompanyOffers from "./component/Company/CompanyOffers";
import CompanyNewOffer from "./component/Company/CompanyNewOffer";
import CompanyNewOfferSent from "./component/Company/CompanyNewOfferSent";
import CompanyOffersAccepted from "./component/Company/CompanyOffersAccepted";
import CompanyOffersConfirmed from "./component/Company/CompanyOffersConfirmed";
import CompanyOffersFinish from "./component/Company/CompanyOffersFinish";
import CompanyOffersfinishedRate from "./component/Company/CompanyOffersfinishedRate";
import CompanyOffersFinishedSent from "./component/Company/CompanyOffersFinishedSent";
import CompanyPostedJobs from "./component/Company/CompanyPostedJobs";
// import CompanySettings from "./component/Company/CompanySettings";
import CompanySettingsAccount from "./component/Company/CompanySettingsAccount";
import CompanySettingsAccountEdit from "./component/Company/CompanySettingsAccountEdit";
//import CompanySettingsAccountEditColleagues from "./component/Company/CompanySettingsAccountEditColleagues";
import CompanySettingAccount from "./component/SettingsAccount/CompanySettingAccount";

import Login from "./component/Auth/Login/Login";
import { AuthRoute } from "./routes/AuthRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NotFound from "./component/CommonComponents/NotFound";
import CompanyRegister from "./component/Company/CompanyRegister";
import CreatePassword from "./component/Auth/CreatePassword";
import CompanyActivate from "./component/Company/CompanyActivate";
import $ from "jquery";
import JobList from "./component/Joblist/JobList";
import JobDetails from "./component/Joblist/JobDetails";
import RePublishJob from "./component/RePublishJob/RePublishJob";


function App() {
    if(window.location.pathname !== "/"){
        $("#tidiochat").remove();
        $("#tidio-chat").remove();
    }
    const loader = useSelector((state) => state.loader.status);
    const userInfo = JSON.parse(localStorage.getItem('userDetails')) || {}
   /* if((userInfo && userInfo.UserType) === "private"){
     return(
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/create-password/:userid" component={CreatePassword} />
          <AuthRoute exact path="/login" component={Login} />
          <PrivateRoute path="/dashboard" component={PrivateNotification} />
          <PrivateRoute path="/Offers" component={Offers} />
          <PrivateRoute path="/offersaccepted" component={OffersAccepted} />
          <PrivateRoute path="/offersconfirmed" component={OffersConfirmed} />
          <PrivateRoute path="/offersaddextra" component={OffersAddExtra} />
          <PrivateRoute path="/offersaddedextra" component={OffersAddedExtra} />
          <PrivateRoute path="/offerscompleted" component={OffersCompleted} />
          <PrivateRoute path="/offersrate" component={OffersRate} />
          <PrivateRoute path="/offersnewOffer" component={OffersNewOffer} />
          <PrivateRoute path="/postajob" component={PostAJob} />
          <PrivateRoute path="/postedjobs" component={PostedJobs} />
          <PrivateRoute path="/settings-account" component={SettingsAccount} />
          <Redirect from='/company/dashboard' to='/' />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
     )
    }else*/ if((userInfo && userInfo.UserType) === "company"){
      return (
        // <div id="wrapper">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/create-password/:userid" component={CreatePassword} />
            <PrivateRoute path="/company/dashboard" component={CompanyDashboard}/>
            <PrivateRoute path="/job-list/:id" component={JobDetails}/>
            <PrivateRoute path="/job-list" component={JobList} />
            <PrivateRoute path="/company/settings-account" component={CompanySettingAccount} />
            <PrivateRoute path="/company/company-offers" component={CompanyOffers} />
            <PrivateRoute path="/company/companynewoffer" component={CompanyNewOffer} />
            <PrivateRoute path="/company/companynewofferSent" component={CompanyNewOfferSent} />
            <PrivateRoute path="/company/companyoffersaccepted" component={CompanyOffersAccepted} />
            <PrivateRoute path="/company/companyoffersconfirmed" component={CompanyOffersConfirmed} />
            <PrivateRoute path="/company/companyoffersfinish" component={CompanyOffersFinish} />
            <PrivateRoute path="/company/companyoffersfinishedRate" component={CompanyOffersfinishedRate} />
            <PrivateRoute path="/company/companyoffersfinishedSent" component={CompanyOffersFinishedSent} />
            <PrivateRoute path="/company/companypostedjobs" component={CompanyPostedJobs} />
            <PrivateRoute path="/company/companysettingsaccount" component={CompanySettingsAccount} />
            <PrivateRoute path="/company/companysettingsaccountedit" component={CompanySettingsAccountEdit} />
            {/*<PrivateRoute path="/company/companysettingsaccounteditcolleagues" component={CompanySettingsAccountEditColleagues} />*/}
          {/*  <Redirect from='/' to='/company/dashboard' />
            <Route exact path="*" component={NotFound} />*/}
          </Switch>
        </Router>
        // </div>
      );
    }else{
      return(
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/re-publish-job/:id" component={RePublishJob} />
            {/*<AuthRoute path="/login" component={Login} />*/}
            <AuthRoute path="/job-list/:id" component={JobDetails}/>
            <AuthRoute path="/job-list" component={JobList}/>
            <AuthRoute path="/company/register" component={CompanyRegister} />
            <AuthRoute path="/register" component={CompanyRegister} />
            <AuthRoute path="/create-password/:userid" component={CreatePassword} />
            <AuthRoute path="/forget-password/:userid" component={CreatePassword} />
            <AuthRoute path="/activate-company/:userid" component={CompanyActivate} />
            <Redirect from={window.location.pathname} to='/' />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
       )
    }
  }
export default App;
