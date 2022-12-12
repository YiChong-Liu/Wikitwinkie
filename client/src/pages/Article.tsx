// Author: Neil Gupta (nog642)
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import "./CreateArticle.css";

const Article = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  console.assert(location.pathname.slice(0, 9) === "/article/");
  const articleName = location.pathname.slice(9);
  useEffect(() => {(async () => {
    const response = await axios.get(`http://${window.location.hostname}:4006/${articleName}`);
    console.log(response);
  })()}, [articleName]);

  return <NLPPage title="Create Article">
    article page
  </NLPPage>;
}

export default Article;
