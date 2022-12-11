import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = (props: {searchbar: boolean}) => {
  const username = Cookies.get("username");
  const navbarAccountManagement = username === undefined ? (
    <Link to="/login"><div className="navbarAccountManagement">Log in</div></Link>
  ) : (
    <button onClick={async () => {
      const response = await axios.post(
        `http://${window.location.hostname}:4001/logout`,
        undefined, // no body
        {withCredentials: true} // send and/or set cookies
      );
      console.log(response);
    }} className="navbarAccountManagement">Log out</button>
  );
  return <div className="navbar">
    <Link to="/"><div className="homeButton">Home</div></Link>
    {navbarAccountManagement}
  </div>;
}

export default NavBar;
