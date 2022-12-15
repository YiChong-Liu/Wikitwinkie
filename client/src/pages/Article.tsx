// Author: Neil Gupta (nog642)
import axios from "axios";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArticleStatus } from "../utils/interfaces";
import type { ArticleServingResponse } from "../utils/interfaces";
import NLPPage from "../lib/NLPPage";
import Comment_Section from "./Comment/Comment_Section";
import Popup from "../lib/Popup";
import ArticleVote from "./Article_Vote";

const Article = () => {
  const location = useLocation();
  if (location.pathname.slice(0, 9) !== "/article/") {
    throw new Error("Could not parse article URL");
  }
  const articleName = location.pathname.slice(9);

  const [articleStatus, setArticleStatus] = useState("loading");
  const [title, setTitle] = useState("Loading...");
  const [contents, setContents] = useState("Loading...");
  const [onRestore, setOnRestore] = useState<() => any>(() => {});

  const [articleId, setArticleId] = useState("");

  useEffect(() => {(async () => {
    const errorSpan = document.getElementById("createArticleError") as HTMLSpanElement;
    const loadArticle = async () => {
      let response: AxiosResponse<ArticleServingResponse>
      try {
        response = await axios.get(`http://${window.location.hostname}:4006/${articleName}`);
      } catch (e) {
        console.error(e);
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
      return response.data.articleId;
    };
    const articleId = await loadArticle();

    // we need an extra layer of function here because if the setter recieves a function
    //    react assumes it's a function that takes the old state and returns the new state,
    //    but in our case we actually want to set the state to a function.
    setOnRestore(() => async () => {
      try {
        await axios.post(
          `http://${window.location.hostname}:4005/restore`,
          { // body
            articleId: articleId
          },
          {withCredentials: true} // send and/or set cookies
        );
      } catch (e) {
        console.error(e);
        const errorSpan = document.getElementById("editArticleError") as HTMLSpanElement;
        if (e instanceof AxiosError && e.response) {
          errorSpan.textContent = `There was an error ${JSON.stringify(e.response.data)}. Please try again.`;
        } else {
          errorSpan.textContent = "There was an unknown error.";
        }
        return;
      }

      // re-render the article
      await loadArticle();
    });
  })();}, [articleName]);

  const loggedIn = Cookies.get("username") !== undefined;

  return <NLPPage title={title}>
    {!loggedIn || articleStatus !== ArticleStatus.ACTIVE ? undefined : <>
      <Link to={"/edit/" + articleName}><div className="btn btn-primary">Edit</div></Link>
      <br/>
    </>}
    {contents}
    {articleStatus !== ArticleStatus.DELETED ? undefined : <><br/><Popup
      buttonText="Restore"
      title="Are you sure?"
      closeText="Cancel"
      confirmText="Restore Article"
      onConfirm={onRestore}
    >Restore article "{title}"?</Popup></>}

    {articleStatus === "loading" ? undefined :
      <><ArticleVote/><Comment_Section articleId={articleId} articleName={articleName}></Comment_Section>
    </>}
  </NLPPage>;
}

export default Article;
