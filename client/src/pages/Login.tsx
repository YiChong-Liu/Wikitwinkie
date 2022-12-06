// import React from "react";
import App from "../lib/App";

const loginSubmit = () => {
  // TODO: request
  console.log((document.getElementById("username") as HTMLInputElement).value);
  console.log((document.getElementById("password") as HTMLInputElement).value);
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
