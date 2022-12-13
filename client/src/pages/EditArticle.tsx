// Author: Neil Gupta (nog642)
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import { ArticleStatus } from "../utils/interfaces";
import type { ArticleServingResponse, ArticleEditResponse } from "../utils/interfaces";
import "./EditArticle.css";

const EditArticle = () => {
  console.log("Rendering EditArticle..")
  const location = useLocation();
  const navigate = useNavigate();

  console.assert(location.pathname.slice(0, 6) === "/edit/");
  const articleName = location.pathname.slice(6);

  const [title, setTitle] = useState<string>();
  const [contents, setContents] = useState<string>();
  const [onSubmit, setOnSubmit] = useState<() => any>();

  useEffect(() => {(async () => {
    let response: AxiosResponse<ArticleServingResponse>
    try {
      response = await axios.get(`http://${window.location.hostname}:4006/${articleName}`);
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
    const articleId = response.data.articleId;
    const loadingSpan = document.getElementById("editArticleLoading") as HTMLSpanElement;
    loadingSpan.textContent = "";
    if (response.data.status === ArticleStatus.ACTIVE) {
      setTitle(response.data.title);
      setContents(response.data.content);
    } else if (response.data.status === ArticleStatus.DELETED) {
      const errorSpan = document.getElementById("editArticleError") as HTMLSpanElement;
      errorSpan.textContent = "This article has been deleted";
    } else {
      console.error(`Unrecognized article status: ${response.data.status}`);
    }

    // we need an extra layer of function here because if the setter recieves a function
    //    react assumes it's a function that takes the old state and returns the new state,
    //    but in our case we actually want to set the state to a function.
    setOnSubmit(() => async () => {
      if (articleId === undefined) {
        console.error("articleId is undefined");
        return;
      }
      const title = (document.getElementById("articleTitle") as HTMLInputElement).value;
      const content = (document.getElementById("articleContent") as HTMLTextAreaElement).value;
      let response: AxiosResponse<ArticleEditResponse>;
      try {
        response = await axios.post(
          `http://${window.location.hostname}:4005/edit`,
          { // body
            articleId: articleId,
            title: title,
            content: content
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
      // const loadingSpan = document.getElementById("editArticleLoading") as HTMLSpanElement;
      loadingSpan.textContent = "Submitting edited article...";
      // wait for the event bus to move data from the articles service to the article serving service
      await new Promise(r => setTimeout(r, 1000));
      // loadingSpan.textContent = "";
      navigate(`/article/${response.data.name}`);
    });
  })();}, [articleName]);

  // redirect to home page if not logged in
  if (Cookies.get("username") === undefined) {
    return  <Navigate replace to="/"/>;
  }

  return <NLPPage title="Edit Article">
    <form id="editArticleForm">
      {title === undefined ? undefined : <Fragment>
        <label className="labels" htmlFor="user">Title: </label>
        <br/>
        <input type="text" id="articleTitle" placeholder="Enter Title" defaultValue={title}/>
        <br/>
      </Fragment>}
      {contents === undefined ? undefined : <Fragment>
        <label className="labels" htmlFor="user">Content: </label>
        <br/>
        <textarea id="articleContent" placeholder="Enter content (Markdown)" defaultValue={contents}/>
      </Fragment>}
      {title === undefined || contents === undefined ? undefined :
        <input id="editArticleSubmit" type="button" value="Edit Article" onClick={onSubmit}/>
      }
    </form>
    <span id="editArticleLoading">Loading...</span>
    <span id="editArticleError" className="errorSpan"></span>
  </NLPPage>;
}

export default EditArticle;
