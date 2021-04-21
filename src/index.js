import React from 'react';
import { ToastContainer } from "react-toastify";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createFirestoreInstance } from 'redux-firestore';
import store from './redux/store';
import { initFirebase, firebase, rrfConfig } from './firebase/firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "react-toastify/dist/ReactToastify.css";
import Loader from "./component/CommonComponents/Loader";

initFirebase();

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
}

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <ToastContainer autoClose={2000} position="top-center" />
            <Loader/>
            <App/>
        </ReactReduxFirebaseProvider>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
