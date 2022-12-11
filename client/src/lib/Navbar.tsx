import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = (props: {searchbar: boolean}) => <div className="navbar">
  <Link to="/"><div className="homeButton">Home</div></Link>
  <div className="navbarAccountManagement">Log in/Sign up</div>
</div>;

export default NavBar;
