import React from "react";
import { Link } from "react-router-dom";
import App from "../lib/App";

const Home = () => {
  return <App title="Placeholder Title">
    This is text on the home page
    <br/>
    <Link to="/login">Log in</Link>
  </App>;
}

export default Home;
