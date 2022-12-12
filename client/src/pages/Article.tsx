// Author: Neil Gupta (nog642)
import axios from "axios";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArticleStatus } from "../utils/interfaces";
import type { ArticleServingResponse } from "../utils/interfaces";
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
    let response: AxiosResponse<ArticleServingResponse>
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
    setTitle(response.data.title);
    if (response.data.status === ArticleStatus.ACTIVE) {
      setContents(response.data.content);
    } else if (response.data.status === ArticleStatus.DELETED) {
      setContents("This article has been deleted")
    } else {
      console.error(`Unrecognized article status: ${response.data.status}`);
    }
  })()}, [articleName]);

  return <NLPPage title={title}>
    {contents}
  </NLPPage>;
}

export default Article;
