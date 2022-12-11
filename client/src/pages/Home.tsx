import { Link } from "react-router-dom";
import NLPPage from "../lib/NLPPage";

const Home = () => {
  return <NLPPage title="Placeholder Title">
    This is text on the home page
    <br/>
    <Link to="/login">Log in</Link>
  </NLPPage>;
}

export default Home;
