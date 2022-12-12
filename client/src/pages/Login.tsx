import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import type { SessionsLoginResponse } from "../utils/interfaces"

const Login = () => {
  const navigate = useNavigate();

  // TODO: reditect to home page if already logged in

  const loginSubmit = async () => {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const response: AxiosResponse<SessionsLoginResponse> = await axios.post(
      `http://${window.location.hostname}:4001/login`,
      { // body
        username: username,
        password: password
      },
      {withCredentials: true} // send and/or set cookies
    );
    console.log(response);
    if (response.data.success) {
      navigate("/");
    } else {
      const loginError = document.getElementById("loginError") as HTMLSpanElement;
      loginError.textContent = response.data.error;
    }
  };

  return <NLPPage title="Log In">
    <form>
      {/* TODO: use html form submit instead of button onclick */}
      <label className  ="labels" htmlFor="user">Username: </label>
      <input type="text" id="username" placeholder="Enter Username"/>
      <br/>
      <label className= "labels" htmlFor="password">Password: </label>
      <input type="password" id="password" placeholder="Enter Password"/>
      <br/>
      <input className="button" type="button" value="Login" onClick={loginSubmit}/>
    </form>
    <span id="loginError" className="errorSpan"></span>
    <br/>
    <label className="minilabels"><Link to="/register">Sign up</Link></label>
  </NLPPage>;
};

export default Login;
