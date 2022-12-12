import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import type { ArticleCreateResponse } from "../utils/interfaces";
import "./CreateArticle.css";

const CreateArticle = () => {
  const navigate = useNavigate();

  // TODO: redirect to home page if not logged in
  if (Cookies.get("username") === undefined) {
    return  <Navigate replace to="/"/>;
  }

  const createArticleSubmit = async () => {
    const title = (document.getElementById("articleTitle") as HTMLInputElement).value;
    const content = (document.getElementById("articleContent") as HTMLTextAreaElement).value;
    let response: AxiosResponse<ArticleCreateResponse>;
    try {
      response = await axios.post(
        `http://${window.location.hostname}:4005/create`,
        { // body
          title: title,
          content: content
        },
        {withCredentials: true} // send and/or set cookies
      );
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        const registerError = document.getElementById("createArticleError") as HTMLSpanElement;
        registerError.textContent = `There was an error ${JSON.stringify(e.response.data)}. Please try again.`;
      }
      return;
    }
    navigate(`/article/${response.data.articleId}`);
  };

  return <NLPPage title="Create Article">
    <form>
      <label className="labels" htmlFor="user">Title: </label>
      <br/>
      <input type="text" id="articleTitle" placeholder="Enter Title"/>
      <br/>
      <label className="labels" htmlFor="user">Content: </label>
      <br/>
      <textarea id="articleContent" placeholder="Enter content (Markdown)"/>
      <input className="button" type="button" value="Create Article" onClick={createArticleSubmit}/>
    </form>
    <span id="createArticleError" className="errorSpan"></span>
  </NLPPage>;
}

export default CreateArticle;
