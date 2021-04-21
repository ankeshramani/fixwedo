import React from "react";
import { Route, Redirect } from "react-router-dom";
/*import { useSelector } from "react-redux";*/
/*import { isLoaded, isEmpty } from 'react-redux-firebase'
import Loader from '../component/CommonComponents/Loader'*/

export const PrivateRoute = ({ component: Component, location, ...rest }) => {
   /* const auth = useSelector(state => state.firebase.auth);*/
    const userId = localStorage.getItem('userId');
    return (
        <Route
            {...rest}
            render={props =>
                userId ? (<Component {...props} />) : (<Redirect to={{ pathname: "/login", location }} />)
            }
        />
    );
};