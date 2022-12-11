import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = (props: {searchbar: boolean}) => {
  const username = Cookies.get("username");
  console.log(username);
  return <div className="navbar">
    <Link to="/"><div className="homeButton">Home</div></Link>
    <div className="navbarAccountManagement">Log in/Sign up</div>
  </div>;
}

export default NavBar;
