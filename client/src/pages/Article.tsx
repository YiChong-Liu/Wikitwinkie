// Author: Neil Gupta (nog642)
import axios from "axios";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArticleStatus } from "../utils/interfaces";
import type { ArticleServingResponse } from "../utils/interfaces";
import NLPPage from "../lib/NLPPage";
import Comment_Section from "./Comment/Comment_Section";

const Article = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  console.assert(location.pathname.slice(0, 9) === "/article/");
  const articleName = location.pathname.slice(9);

  const [articleStatus, setArticleStatus] = useState("loading");
  const [title, setTitle] = useState("Loading...");
  const [contents, setContents] = useState("Loading...");

  const [articleId, setArticleId] = useState("");

  useEffect(() => {(async () => {
    let response: AxiosResponse<ArticleServingResponse>
    try {
      response = await axios.get(`http://${window.location.hostname}:4006/${articleName}`);
    } catch (e) {
      console.error(e);
      const errorSpan = document.getElementById("createArticleError") as HTMLSpanElement;
      if (e instanceof AxiosError && e.response) {
        if (e.response.status === 404) {
          setTitle("404 Not Found");
          setContents(`Article not found.`)
        } else {
          errorSpan.textContent = `There was an error ${JSON.stringify(e.response.data)}. Please try again.`;
        }
      } else {
        errorSpan.textContent = "There was an unknown error.";
      }
      return;
    }
    setTitle(response.data.title);
    if (response.data.status === ArticleStatus.ACTIVE) {
      setContents(response.data.content);
      setArticleStatus(ArticleStatus.ACTIVE);
      setArticleId(response.data.articleId);

    } else if (response.data.status === ArticleStatus.DELETED) {
      setContents("This article has been deleted")
      setArticleStatus(ArticleStatus.DELETED);
    } else {
      console.error(`Unrecognized article status: ${response.data.status}`);
      return;
    }
  })()}, [articleName]);

  const loggedIn = Cookies.get("username") !== undefined;

  return <NLPPage title={title}>
    {!loggedIn || articleStatus === "loading" ? undefined : <Fragment>
      <Link to={"/edit/" + articleName}><div className="btn btn-primary">Edit</div></Link>
      <br/>
    </Fragment>}
    {contents}

    {articleStatus === "loading" ? undefined :
      <Comment_Section articleId={articleId} articleName={articleName}></Comment_Section>
    }
  </NLPPage>;
}

export default Article;
