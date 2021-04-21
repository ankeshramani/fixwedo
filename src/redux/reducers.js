import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import loaderReducer from './reducers/loaderReducer';

export default combineReducers({
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    loader: loaderReducer
});