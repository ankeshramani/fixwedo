import React, { useEffect, useState } from "react";
import { isLoaded, withFirestore, useFirestore } from 'react-redux-firebase';
import Dashboardfooter from '../Layout/DashboardFooter';
import Dashboardheader from '../Layout/DashboardHeader';
import CompanySideBar from '../Layout/CompanySideBar';

import images from "../../utils/ImageHelper";
import {toast} from "react-toastify";
import * as actions from "../../redux/action/actions";
import {useDispatch} from "react-redux";
const initialState = {
    FullName: "-",
    ProfileImage: "",
    Base64: "",
    AboutUs: "-",
    UserType: 'private',
    OrganizationNo: 123456,
    Address: '',
    telephone: ''
}

const CompanySettingsAccountEditColleagues = () => {
    const dispatch = useDispatch();
    const [isModal, setIsModal] = useState(false);
    const [userDetail, setUserDetails] = useState(initialState);
    const [colleagues, setColleagues] = useState([]);
    const [colleaguesList, setColleaguesList] = useState([]);
    const [searchColleague, setSearchColleague] = useState('');
    const [filterColleagues, setFilterColleagues] = useState([]);
    const [selectedColleague, setSelectedColleague] = useState({id: ''});
    const firebase = useFirestore();

    React.useEffect(() => {
        const UserId = localStorage.getItem('userId')
        var doctblUser = firebase.collection("tblUser").doc(UserId);
        doctblUser.get()
            .then(function (querySnapshot) {
                if (querySnapshot.exists) {
                    const data = querySnapshot.data();
                    data.id = querySnapshot.id;
                    let merged = { ...initialState, ...data };
                    setUserDetails(merged)
                    console.log("Document data:", data);
                } else {
                    console.error("No such document!");
                }
            }).catch(function (error) {
            console.error("Error getting documents: ", error);
        });
        firebase.collection("tblUser")
            .where("UserType", "==", "private")
            .get()
            .then(querySnapshot => {
                const postData = [];
                querySnapshot.forEach((doc) => postData.push({ ...doc.data(), id: doc.id }))
                setColleagues(postData)
                firebase.collection("tblColleague").get().then(querySnapshot => {
                    const data = [];
                    querySnapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }))
                    const colleague = []
                    postData.map((x) => {
                        data.map((y) => {
                            if(y.ColleagueId === x.id){
                                const obj = {...x, ColleagueId: y.id}
                                colleague.push(obj)
                            }
                        })
                    })
                    setColleaguesList(colleague)
                });
            });

    }, [])

    const onSearch = (event) => {
        setSearchColleague(event.target.value)
        const clone= [...colleagues]
        let filterData = clone.filter((ser) => {
            return ser.Name.includes(event.target.value) || ser.Email.includes(event.target.value)
        });
        setFilterColleagues(filterData)

    }
    const selectColleague = (record) => {
        setSelectedColleague(record)
    }

    const onRemoveColleagues = (record) => {
        dispatch(actions.setLoader(true));
        firebase.collection("tblColleague").doc(record.ColleagueId).delete().then((res) => {
            const clone = [...colleaguesList]
            const index = clone.findIndex((y) => y.ColleagueId === record.ColleagueId)
            clone.splice(index, 1)
            setColleaguesList(clone)
            dispatch(actions.setLoader(false));
            toast.success("Colleague delete successfully");
        }).catch((error) => {
            dispatch(actions.setLoader(false));
            toast.error("Something went wrong please try again");
        })

    }

    const onAddColleague = () => {
        dispatch(actions.setLoader(true));
        const UserId = localStorage.getItem('userId')
        const record = colleaguesList.find((x) => x.id === selectedColleague.id) || {}
        if(record.id === selectedColleague.id){
            toast.error("Colleague already Added");
            dispatch(actions.setLoader(false));
        } else {
            firebase.collection("tblColleague").add({
                ColleagueId: selectedColleague.id,
                companyId: UserId,
                IsActive: true,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
            }).then((result) => {
                const clone = [...colleaguesList]
                clone.push(selectedColleague)
                setColleaguesList(clone)
                setSelectedColleague({})
                setSearchColleague('')
                dispatch(actions.setLoader(false));
                toast.success("Colleague Added successfully");
            }).catch((error) => {
                dispatch(actions.setLoader(false));
                toast.error("Something went wrong please try again");
            });
        }
    }

    const onOpenModal = () => {
        setIsModal(true)
    }

    const onCloseModal = () => {
        setIsModal(false)
        setSearchColleague('')
    }

    return (
        <div className="colleaguebox">
            <div className="colleague-title">
                <h2>{userDetail.FullName}, <span>Colleagues</span></h2>
                <div className="colleague-btn">
                    <button onClick={onOpenModal}><a className="colleague">Add Colleague</a></button>
                </div>
                <div className={`add-colleagues-box ${isModal ? 'box' : ''}`}>
                    <h3>Add New Colleague</h3>
                    <button className="close-colleagues" onClick={onCloseModal}><i className="fas fa-times"/></button>
                    <div className="add-colleagues">
                        <div className="colleague-img">
                            <img src={selectedColleague.ProfileImage || images.setting1} alt={selectedColleague.ProfileImage || images.setting1}  style={{width: 292, height:292}}></img>
                            <h4>{selectedColleague.FullName || "-"}</h4>
                            <h5>
                                <a className="dotshap" href={`mailto:${selectedColleague.Email || "-"}`}>{selectedColleague.Email || "-"}</a>
                                <a href={`tel:${selectedColleague.telephone || "-"}`}>{selectedColleague.Phone || "-"}</a>
                            </h5>
                        </div>
                    </div>
                    <div className="colleague-search">
                        <div className="colleague-add-search-box">
                            <div className="colleague-search-box">
                                <input type="text" name="searchColleague" value={searchColleague} onChange={onSearch} placeholder="Search Colleague" className="search-colleagues"/>
                                <i className="fas fa-search colle-icon"/>
                            </div>
                            <button onClick={onAddColleague} disabled={selectedColleague.id === ""} style={{border: 0, padding: 0,outline: "none",}}><a >Add Colleague</a></button>
                        </div>
                    </div>
                    {searchColleague === "" ? "" : <div className="search-colleague-data"><div className="row">
                        {
                            (filterColleagues || []).map((x, i) => {
                                return (
                                    <div className="col-xxl-4 col-md-6 col-sm-6 col-12" key={i} onClick={() => selectColleague(x)}>
                                        <div className="first-img">
                                            <img src={x.ProfileImage || images.setting1} alt={x.ProfileImage || images.setting1}></img>
                                            <h4>{x.FullName || "-"}</h4>
                                            <h5>
                                                <a className="dotshap" href={`mailto:${x.Email || "-"}`}>{x.Email || "-"}</a>
                                                <a href={`tel:${x.telephone || "-"}`}>{x.telephone || "-"}</a>
                                            </h5>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div></div>}
                </div>

            </div>
            <div className="row">
                {
                    (colleaguesList || []).map((x, i) => {
                        return(
                            <div className="col-xxl-4 col-md-6 col-sm-6 col-12" key={i} >
                                <div className="first-img">
                                    <img src={x.ProfileImage || images.setting1} alt={x.ProfileImage || images.setting1} ></img>
                                    <h4>{x.FullName || "-"}</h4>
                                    <h5>
                                        <a className="dotshap"  href={`mailto:${x.Email || "-"}`}>{x.Email || "-"}</a>
                                        <a href={`tel:${x.telephone || "-"}`}>{x.telephone || "-"}</a>
                                    </h5>
                                    <button onClick={() => onRemoveColleagues(x)}>Remove</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
export default CompanySettingsAccountEditColleagues;