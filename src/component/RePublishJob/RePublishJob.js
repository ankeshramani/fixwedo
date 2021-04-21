import React from 'react'
import {ApiService} from "../../ApiService";
import {useParams} from "react-router";

const RePublishJob = () => {
    let apiService = new ApiService()
    const {id} = useParams();
    console.log(id)
    const onRePublishJob = async ()  => {
        //const data = await
    }
    return(
        <div>
            Loading...
        </div>
    )
};
export default RePublishJob