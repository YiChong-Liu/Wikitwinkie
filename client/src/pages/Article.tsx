// Author: Neil Gupta (nog642)
import axios from "axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import "./CreateArticle.css";

const Article = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  console.assert(location.pathname.slice(0, 9) === "/article/");
  const articleName = location.pathname.slice(9);

  const [title, setTitle] = useState("Loading...");
  const [contents, setContents] = useState("Loading...");

  useEffect(() => {(async () => {
    let response;
    try {
      response = await axios.get(`http://${window.location.hostname}:4006/${articleName}`);
    } catch (e) {
      console.error(e);
      const registerError = document.getElementById("createArticleError") as HTMLSpanElement;
      if (e instanceof AxiosError && e.response) {
        if (e.response.status === 404) {
          setTitle("404 Not Found");
          setContents(`Article not found.`)
        } else {
          registerError.textContent = `There was an error ${JSON.stringify(e.response.data)}. Please try again.`;
        }
      } else {
        registerError.textContent = "There was an unknown error.";
      }
      return;
    }
    console.log(response);
  })()}, [articleName]);

  return <NLPPage title={title}>
    {contents}
  </NLPPage>;
}

export default Article;
