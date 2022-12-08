import axios from 'axios';
import App from "../lib/App";

const loginSubmit = async () => {
  // TODO: request
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const response = await axios.post('http://localhost:4002/login', {
    username: username,
    password: password
  });
  console.log(response);
};

const Login = () => <App title="Log In">
  <label className  ="labels" htmlFor="user">Username: </label>
  {/* <br/> */}
  <input className="textBoxes" type="text" id="username" placeholder="Enter Username"/>
  <br/>
  <label className= "labels" htmlFor="password">Password: </label>
  {/* <br/> */}
  <input className="textBoxes" type="password" id="password" placeholder="Enter Password"/>
  <br/>
  <input className="button" id="login" type="button" value="Login" onClick={loginSubmit}/>
  <br/>
  <br/>
  <label className="minilabels"><a href="/register">Sign up</a></label>
</App>;

export default Login;
