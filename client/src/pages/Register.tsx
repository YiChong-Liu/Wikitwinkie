import axios from "axios";
import type { AxiosResponse } from "axios";
import App from "../lib/App";
import type { AccountManagementCreateUserResponse } from "../utils/interfaces";

const signupSubmit = async () => {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const response: AxiosResponse<AccountManagementCreateUserResponse> = await axios.post(
    `http://${window.location.hostname}:4002/createUser`,
    {
      username: username,
      password: password
    }
  );
  console.log(response);
  if (response.data.success) {
    console.log(response.data.sessionId);
  } else {
    console.log(response.data.error);
  }
};

const Register = () => <App title="Sign Up">
  <label className  ="labels" htmlFor="user">Username: </label>
  {/* <br/> */}
  <input className="textBoxes" type="text" id="username" placeholder="Enter Username"/>
  <br/>
  <label className= "labels" htmlFor="password">Password: </label>
  {/* <br/> */}
  <input className="textBoxes" type="password" id="password" placeholder="Enter Password"/>
  <br/>
  <input className="button" id="signup" type="button" value="Sign Up" onClick={signupSubmit}/>
</App>;

export default Register;
