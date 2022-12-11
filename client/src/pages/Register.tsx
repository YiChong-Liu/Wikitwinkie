import axios from "axios";
import type { AxiosResponse } from "axios";
import NLPPage from "../lib/NLPPage";
import type { AccountManagementCreateUserResponse } from "../utils/interfaces";

const signupSubmit = async () => {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const response: AxiosResponse<AccountManagementCreateUserResponse> = await axios.post(
    `http://${window.location.hostname}:4002/createUser`,
    {
      username: username,
      password: password
    },
    {withCredentials: true}
  );
  console.log(response);
  if (response.data.success) {
    console.log(response.data.sessionId);
  } else {
    console.log(response.data.error);
  }
};

const Register = () => <NLPPage title="Sign Up">
  <form>
    {/* TODO: use html form submit instead of button onclick */}
    <label className  ="labels" htmlFor="user">Username: </label>
    <input className="textBoxes" type="text" id="username" placeholder="Enter Username"/>
    <br/>
    <label className= "labels" htmlFor="password">Password: </label>
    <input className="textBoxes" type="password" id="password" placeholder="Enter Password"/>
    <br/>
    <input className="button" id="signup" type="button" value="Sign Up" onClick={signupSubmit}/>
  </form>
</NLPPage>;

export default Register;
