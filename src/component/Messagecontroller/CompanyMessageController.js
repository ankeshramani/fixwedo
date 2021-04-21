import React, { useState } from "react";
import {useFirestore, withFirestore} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import images from "../../utils/ImageHelper";
import moment from 'moment'
import {useHistory} from "react-router-dom";

const MessageController = ({ isMessageController, chatsDetails, userDetails  }) => {
    const firebase = useFirestore();
    const [dataList, setData] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    let history = useHistory();
    const userId = localStorage.getItem('userId')
    React.useEffect(() => {
        firebase.setListeners([
            {
                collection: 'tblChatMessage',
                storeAs: 'chatsDetails'
            },
            {
                collection: 'tblUser',
                storeAs: 'userDetails'
            }
        ])
    }, [firebase])

    React.useEffect(() => {
        if((chatsDetails && chatsDetails.length) && (userDetails && userDetails.length)){
            const companyMessage = []
            const chetWithCompany = chatsDetails.filter((l) => l.companyId === userId);
            chetWithCompany.map((x) => {
                userDetails.map((y) => {
                    if(x.userId === y.id){
                        const receivedMessage = x && x.chat ? (x.chat || []).filter((z) => z.sendTo === userId && z.isRead === false) : [];
                        const lastMessage = receivedMessage.sort((a, b) => (b.messageDate) - (a.messageDate))
                        if(receivedMessage && receivedMessage.length){
                            const obj = {
                                ...x,
                                userName: y.UserName,
                                ProfileImage: y.ProfileImage,
                                messageCount: receivedMessage && receivedMessage.length,
                                lastMessage: lastMessage ? lastMessage[0] : {message: ''}
                            }
                            companyMessage.push(obj)
                        }
                    }
                })
            })
            setData(companyMessage)
        }
    }, [chatsDetails, userDetails])

    React.useEffect(() => {
        return () => {
            firebase.setListeners([
                {
                    collection: 'tblChatMessage',
                    storeAs: 'chatsDetails'
                },
                {
                    collection: 'tblUser',
                    storeAs: 'userDetails'
                }
            ])
        };
    }, [firebase]);


    const onSearch = (event) => {
        setSearchUser(event.target.value)
    }

    const getAllStore = () => {
        let dataItem = [];
        const searchKey = searchUser && searchUser.toUpperCase();
        let storesData = dataList.slice();
        if (searchKey) {
            dataItem = (storesData || []).filter(
                p => (p.userName && p.userName.toUpperCase()).includes(searchKey));
        } else {
            dataItem = dataList;
        }
        return dataItem;
    };

    const storeDataList = getAllStore();

    const onRedirectOffer = (x) => {
        history.push(`/company/company-offers?userId=${x.userId}&projectId=${x.projectId}`)
    }

    return(
        <div id="sidebar" className={`users chat-user ${isMessageController ? 'menu-left-open' : ''}`}>
            <div className="message-box">
                <div className="chat-search-box">
                    <a className="back_friendlist" href="/#">
                        <i className="feather icon-x"></i>
                    </a>
                    <div className="settingbox">
                        <h4>
                            Messages
                            <a href="/company/settings-account">
                                <img src={require("../../images/images/settings.png")} alt="" ></img>
                            </a>
                        </h4>
                    </div>
                    <div className="right-icon-control">
                        <div className="input-group input-group-button">
                            <i className="fas fa-search searchbox"></i>
                            <input type="text" className="search-control" name="searchUser" value={searchUser} onChange={onSearch} placeholder="Search by Name"/>
                        </div>
                    </div>
                </div>
            </div>
            {(storeDataList || []).map((x, i) => {
                return(
                    <div className="userbox" key={i} onClick={() => onRedirectOffer(x)}>
                        <a className="media-left" >
                            <img src={x.ProfileImage || images.setting1} alt={x.ProfileImage || images.setting1} style={{width: 74, height: 74}}></img>
                        </a>
                        <div className="media-body">
                            <h6>{x.userName}{x.messageCount === 0 ? "" : <span>{x.messageCount}</span>}</h6>
                            <p>{x && x.lastMessage && x.lastMessage.message}</p>
                        </div>
                    </div>
                )})
            }
        </div>
    )
}
export default compose(
    withFirestore,
    connect((state) => ({
        chatsDetails: (state.firestore.ordered && state.firestore.ordered.chatsDetails) || [],
        userDetails: (state.firestore.ordered && state.firestore.ordered.userDetails) || [],
    }))
)(MessageController)

