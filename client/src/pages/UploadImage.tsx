/*
Author: Yichong Liu (https://github.com/YiChong-Liu)
Date: 12-12-2022
*/


import axios, { AxiosError } from "axios";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import NLPPage from "../lib/NLPPage";
import "./UploadImage.css";

const UploadImage = () => {

    // const navigate = useNavigate();

    // redirect to home page if not logged in
    if (Cookies.get("username") === undefined) {
        return  <Navigate replace to="/"/>;
    }

    const uploadImageSubmit = async () => {
        const reader = new FileReader();

        const image = (document.getElementById("image") as HTMLInputElement).files;
        if (image === null) {
            return;
        }

        reader.readAsBinaryString(image[0]);
        const imageName = (document.getElementById("imageName") as HTMLInputElement).value;
        const imageDescription = (document.getElementById("imageDescription") as HTMLInputElement).value;

        reader.onload = async () => {
            try {
                const response = await axios.post(
                    `http://${window.location.hostname}:4003/image/${imageName}`,
                    {
                        image: reader.result,
                        imageName: imageName,
                        imageDescription: imageDescription
                    },
                    { withCredentials: true } // send and/or set cookies}
                )
                // a pop up window to show the image is uploaded successfully
                alert("Image uploaded successfully!");
            } catch (e) {
                console.error(e);
                if (e instanceof AxiosError && e.response) {
                    // a pop up window to show the image is duplicated or session failed
                    alert(`Error submitting image ${JSON.stringify(e.response.data)}!`);
                } else {
                    alert(`Unknown error submitting image!`);
                }
            }
        }
    }

    return <NLPPage title="Upload Image">
        <form>
            <label className="labels" htmlFor="user">Image: </label>
            <br />
            <input type="file" id="image" placeholder="Upload Image" />
            <br />
            <br />
            <label className="labels" htmlFor="user">Image Name: </label>
            <br />
            <input type="text" id="imageName" placeholder="Enter Image Name" />
            <br />
            <br />
            <label className="labels" htmlFor="user">Image Description: </label>
            <br />
            <input type="text" id="imageDescription" placeholder="Enter Image Description" />
            <br />
            <br />
            <br />
            <input className="button" type="button" value="Submit" onClick={uploadImageSubmit} />
        </form>
    </NLPPage>;
};

export default UploadImage;