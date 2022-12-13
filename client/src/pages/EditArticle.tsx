// Author: Neil Gupta (nog642)
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import { ArticleStatus } from "../utils/interfaces";
import type { ArticleServingResponse } from "../utils/interfaces";
import "./EditArticle.css";

const EditArticle = () => {
  console.log("Rendering EditArticle..")
  const location = useLocation();
  // const navigate = useNavigate();

  console.assert(location.pathname.slice(0, 6) === "/edit/");
  const articleName = location.pathname.slice(6);

  const [title, setTitle] = useState<string>();
  const [contents, setContents] = useState<string>();

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
  })()}, [articleName]);

  // redirect to home page if not logged in
  if (Cookies.get("username") === undefined) {
    return  <Navigate replace to="/"/>;
  }

  const editArticleSubmit = async () => {
  //   const title = (document.getElementById("articleTitle") as HTMLInputElement).value;
  //   const content = (document.getElementById("articleContent") as HTMLTextAreaElement).value;
  //   let response: AxiosResponse<ArticleCreateResponse>;
  //   try {
  //     response = await axios.post(
  //       `http://${window.location.hostname}:4005/create`,
  //       { // body
  //         title: title,
  //         content: content
  //       },
  //       {withCredentials: true} // send and/or set cookies
  //     );
  //   } catch (e) {
  //     console.error(e);
  //     const errorSpan = document.getElementById("editArticleError") as HTMLSpanElement;
  //     if (e instanceof AxiosError && e.response) {
  //       errorSpan.textContent = `There was an error ${JSON.stringify(e.response.data)}. Please try again.`;
  //     } else {
  //       errorSpan.textContent = "There was an unknown error.";
  //     }
  //     return;
  //   }
  //   const loadingSpan = document.getElementById("editArticleLoading") as HTMLSpanElement;
  //   loadingSpan.textContent = "Editing article...";
  //   // wait for the event bus to move data from the articles service to the article serving service
  //   await new Promise(r => setTimeout(r, 1000));
  //   // loadingSpan.textContent = "";
  //   navigate(`/article/${response.data.articleId}`);
  };

  return <NLPPage title="Create Article">
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
        <input className="button" type="button" value="Edit Article" onClick={editArticleSubmit}/>
      }
    </form>
    <span id="editArticleLoading">Loading...</span>
    <span id="editArticleError" className="errorSpan"></span>
  </NLPPage>;
}

export default EditArticle;
