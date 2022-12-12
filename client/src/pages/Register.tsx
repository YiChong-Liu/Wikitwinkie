import axios from "axios";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import type { SessionsLoginResponse } from "../utils/interfaces";

const Register = () => {
  const navigate = useNavigate();

  // TODO: reditect to home page if already logged in

  const signupSubmit = async () => {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const response: AxiosResponse<SessionsLoginResponse> = await axios.post(
      `http://${window.location.hostname}:4002/createUser`,
      { // body
        username: username,
        password: password
      },
      {withCredentials: true} // send and/or set cookies
    );
    if (response.data.success) {
      navigate("/");
    } else {
      const registerError = document.getElementById("registerError") as HTMLSpanElement;
      registerError.textContent = response.data.error;
    }
  };

  return <NLPPage title="Sign Up">
    <form>
      {/* TODO: use html form submit instead of button onclick */}
      <label className  ="labels" htmlFor="user">Username: </label>
      <input type="text" id="username" placeholder="Enter Username"/>
      <br/>
      <label className= "labels" htmlFor="password">Password: </label>
      <input type="password" id="password" placeholder="Enter Password"/>
      <br/>
      <input className="button" type="button" value="Sign Up" onClick={signupSubmit}/>
    </form>
    <span id="registerError" className="errorSpan"></span>
  </NLPPage>;
};

export default Register;
