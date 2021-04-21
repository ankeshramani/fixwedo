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
            const chetWithCompany = chatsDetails.filter((l) => l.userId === userId);
            // eslint-disable-next-line array-callback-return
            chetWithCompany.map((x) => {
                // eslint-disable-next-line array-callback-return
                userDetails.map((y) => {
                    if(x.companyId === y.id){
                        const receivedMessage = x && x.chat ? (x.chat || []).filter((z) => z.sendTo === userId) : [];
                        const messageCount = receivedMessage.filter((j) => j.isRead === false) || [];
                        const lastMessage = receivedMessage.sort((a, b) => (moment(a.messageDate) - moment(b.messageDate)))
                        const obj = {
                            ...x,
                            CompanyName: y.FullName,
                            CompanyProfileImage: y.ProfileImage,
                            messageCount: messageCount && messageCount.length,
                            lastMessage: lastMessage ? lastMessage[0] : {message: ''}
                        }
                        companyMessage.push(obj)
                    }
                })
            })
            setData(companyMessage)
        }
    }, [chatsDetails, userDetails])

    React.useEffect(() => {
        return () => {
            firebase.unsetListeners([
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
                p => (p.CompanyName && p.CompanyName.toUpperCase()).includes(searchKey));
        } else {
            dataItem = dataList;
        }
        return dataItem;
    };

    const storeDataList = getAllStore();

    const onRedirectOffer = (x) => {
        history.push(`/offers?userId=${x.userId}&projectId=${x.projectId}`)
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
                            <a href="/settings-account">
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
                        <a className="media-left">
                            <img src={x.CompanyProfileImage || images.setting1} alt={x.CompanyProfileImage || images.setting1} style={{width: 74, height: 74}}/>
                        </a>
                        <div className="media-body">
                            <h6>{x.CompanyName}{x.messageCount === 0 ? "" : <span>{x.messageCount}</span>}</h6>
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

