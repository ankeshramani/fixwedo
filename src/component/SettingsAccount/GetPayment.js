import React from "react";
import {useFirestore, withFirestore} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import {sumOfArray} from "../../utils/utility";

function GetPayment({paymentInfo, withdrawalData}) {
    const [amount, setAmount] = React.useState("")
    const firebase = useFirestore();

    React.useEffect(() => {
        firebase.get({
            collection: "tblPaidPaymentInfo",
            storeAs: "paymentInfo"
        });
        firebase.get({
            collection: "tblWithdrawal",
            storeAs: "withdrawalData"
        });
    }, []);

    const userId = localStorage.getItem('userId')
    const userData = paymentInfo.filter(u => u.companyId === userId)
    const allData = userData.map(d => Number(d.amount))
    const totalPayment = allData.reduce(function (a, b) {
        return a + b;
    }, 0);

    const onChange = (e) =>{
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setAmount( e.target.value)
        }
    }

    const withdrawalAmt = () =>{

    }

    const totalWithdrawalItems = withdrawalData.map(f => Number(f.amount))
    const totalWithdrawal = sumOfArray(totalWithdrawalItems)

    const finalPayment = (totalPayment * process.env.REACT_APP_PRIVATE_PERCENTAGE / 100) - totalWithdrawal

    return (
        <div className="profile-main-wrapper">
            <div className="profile-title">
                Total Amount <b>{finalPayment}</b>
            </div>
            <div className="profile-title">
                Withdrawal <b>{totalWithdrawal}</b>
            </div>
            <input type="text" value={amount} onChange={onChange}/>
            <button disabled={amount >= finalPayment} onClick={withdrawalAmt}>Withdrawal</button>
        </div>
    );
}

export default compose(
    withFirestore,
    connect((state) => ({
        paymentInfo: (state.firestore.ordered && state.firestore.ordered.paymentInfo) || [],
        withdrawalData: (state.firestore.ordered && state.firestore.ordered.withdrawalData) || [],
    }))
)(GetPayment);
