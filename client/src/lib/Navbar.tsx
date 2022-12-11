import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = (props: {searchbar: boolean}) => {
  const username = Cookies.get("username");
  const navbarAccountManagement = username === undefined ? (
    <Link to="/login"><div className="navbarAccountManagement">Log in</div></Link>
  ) : (
    <div className="navbarAccountManagement">Log out</div>
  );
  return <div className="navbar">
    <Link to="/"><div className="homeButton">Home</div></Link>
    {navbarAccountManagement}
  </div>;
}

export default NavBar;
