/*
Author: Yichong Liu (https://github.com/YiChong-Liu)
Date: 12-12-2022
*/


import axios, { AxiosError } from "axios";
// import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import "./UploadImage.css";

const UploadImage = () => {
    // const navigate = useNavigate();

    const uploadImageSubmit = async () => {};

    return <NLPPage title="Upload Image"> 
    <form>
        <label className="labels" htmlFor="user">Image: </label>
        <br/>
        <input type="file" id="image" placeholder="Upload Image"/>
        <br/>
        <br/>
        <label className="labels" htmlFor="user">Image Name: </label>
        <br/>
        <input type="text" id="imageName" placeholder="Enter Image Name"/>
        <br/>
        <br/>
        <label className="labels" htmlFor="user">Image Description: </label>
        <br/>
        <input type="text" id="imageDescription" placeholder="Enter Image Description"/>
        <br/>
        <br/>
        <br/>
        <input className="button" type="button" value="Submit" onClick={uploadImageSubmit}/>
    </form>
    </NLPPage>;
}

export default UploadImage;