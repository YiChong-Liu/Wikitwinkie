import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import type { SessionsLoginResponse } from "../utils/interfaces"

const loginSubmit = async () => {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const response: AxiosResponse<SessionsLoginResponse> = await axios.post(
    `http://${window.location.hostname}:4001/login`,
    {
      username: username,
      password: password
    }
  );
  if (response.data.success) {
    console.log(response.data.sessionId);
  } else {
    const loginError = document.getElementById("loginError") as HTMLSpanElement;
    loginError.textContent = response.data.error;
  }
  console.log(response);
};

const Login = () => <NLPPage title="Log In">
  <form>
    {/* TODO: use html form submit instead of button onclick */}
    <label className  ="labels" htmlFor="user">Username: </label>
    <input className="textBoxes" type="text" id="username" placeholder="Enter Username"/>
    <br/>
    <label className= "labels" htmlFor="password">Password: </label>
    <input className="textBoxes" type="password" id="password" placeholder="Enter Password"/>
    <br/>
    <input className="button" id="login" type="button" value="Login" onClick={loginSubmit}/>
  </form>
  <span id="loginError" className="errorSpan"></span>
  <br/>
  <label className="minilabels"><Link to="/register">Sign up</Link></label>
</NLPPage>;

export default Login;
