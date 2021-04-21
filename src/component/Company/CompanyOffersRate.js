import React, {useState} from "react";

import {useFirestore, withFirestore} from "react-redux-firebase";
import {toast} from "react-toastify";
import {compose} from "redux";
import {connect} from "react-redux";

const CompanyOffersRate = ({reviewDetails, close, ...props}) => {

    const [isAlreadyRating, setIsAlreadyRating] = useState(false);
    const [reviewId, setReviewId] = useState('');
    const [commentForCompany, setCommentForCompany] = useState('');
    const [reviewForCompany, setReviewForCompany] = useState(0);
    const [commentForUser, setCommentForUser] = useState('');
    const [reviewForUser, setReviewForUser] = useState(0);
    const [userId, setUserId] = useState('');
    const firebase = useFirestore();
    const companyUserId = localStorage.getItem('userId')
    React.useEffect(() => {
        firebase.setListeners([
            {
                collection: 'tblReview',
                storeAs: 'reviewDetails'
            },
        ])
    }, [firebase]);
    React.useEffect(() => {
        let reviewData = reviewDetails.find((x) => x && x.projectId === props.projectId)
        if(reviewData && reviewData.projectId === props.projectId){
            setIsAlreadyRating(reviewData.companyId !== "")
            setReviewId(reviewData.id)
            setCommentForCompany(reviewData.commentForCompany)
            setReviewForCompany(reviewData.reviewForCompany)
            setCommentForUser(reviewData.commentForUser)
            setReviewForUser(reviewData.reviewForUser)
            setUserId(reviewData.userId)
        } else {
            setIsAlreadyRating(false)
        }

    },[reviewDetails]);
    const Star = ({ selected = false, onClick = f => f }) => (
        <li onClick={onClick}><i className="fas fa-star" style={{color: selected ? "#ffba00" : "#c2c7c3"}}></i></li>
    );
    const change = (starsSelected) => {
        setReviewForUser(starsSelected)
    }

    const onsubmit = () => {

        if(userId && reviewId){
            firebase.collection("tblReview").doc(reviewId).set({
                projectId: props.projectId,
                companyId: companyUserId,
                userId: userId,
                commentForCompany: commentForCompany,
                commentForUser: commentForUser,
                reviewForUser: reviewForUser,
                reviewForCompany: reviewForCompany
            }).then((doc) => {
                toast.success("Review create successfully");
                setIsAlreadyRating(true)
            }).catch(error => {
                console.log(error)
            });
        } else {
            firebase.collection("tblReview").add({
                projectId: props.projectId,
                companyId: companyUserId,
                userId: '',
                commentForCompany: commentForCompany,
                reviewForCompany: reviewForCompany,
                commentForUser: commentForUser,
                reviewForUser: reviewForUser,
            }).then(docRef => {
                toast.success("Review create successfully");
                setIsAlreadyRating(true)
            }).catch((error) => {

            });
        }

    }

    return (
        <div className="reveiw-box-wrapper m-b-0">
            <div className="reveiw-inner-box">
                <div className="reveiw-box-title">
                    <h4>Payment Successful! Now please Rate the Worker. <i className="fas fa-times" onClick={close}></i>
                    </h4>
                </div>
                <div className="reveiw-star">
                    <ul className="reveiw-star-icon">
                        {[...Array(5)].map((n, i) => (
                            <Star
                                key={i}
                                selected={i < reviewForUser}
                                onClick={isAlreadyRating ? null : () => change(i + 1)}
                            />
                        ))}
                    </ul>
                </div>
                {
                    isAlreadyRating ? null : <div className="reveiw-submit detail-btn detail-space" onClick={onsubmit}>
                        <a>submit</a>
                    </div>
                }
            </div>
        </div>
    );
}

export default compose(
    withFirestore,
    connect((state) => ({
        reviewDetails: (state.firestore.ordered && state.firestore.ordered.reviewDetails) || [],
    }))
)(CompanyOffersRate)