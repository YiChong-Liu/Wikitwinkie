import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const NavBar = (props: {searchbar: boolean}) => {
  const navigate = useNavigate();
  const username = Cookies.get("username");
  const navbarAccountManagement = username === undefined ? (
    <Link to="/login" className="navbarAccountManagementOuter">
      <div className="navbarAccountManagementText">Log in</div>
    </Link>
  ) : (
    <button onClick={async () => {
      const response = await axios.post(
        `http://${window.location.hostname}:4001/logout`,
        undefined, // no body
        {withCredentials: true} // send and/or set cookies
      );
      console.log(response);
      navigate("/");
    }} className="navbarAccountManagementOuter navbarAccountManagementText">Log out</button>
  );
  return <div className="nlpnavbar">
    <Link to="/"><div className="leftNavbarButton">Home</div></Link>
    {username === undefined ? undefined : <Link to="/createArticle">
      <div className="leftNavbarButton">Create page</div>
    </Link>}
    {username === undefined ? undefined : <Link to="/uploadImage">
      <div className="leftNavbarButton">Upload image</div>
    </Link>}
    {navbarAccountManagement}
  </div>;
}

export default NavBar;
