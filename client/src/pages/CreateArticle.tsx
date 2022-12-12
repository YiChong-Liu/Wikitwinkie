import axios, { AxiosError } from "axios";
// import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import "./CreateArticle.css";

const CreatePage = () => {
  // const navigate = useNavigate();

  const createArticleSubmit = async () => {
    const title = (document.getElementById("articleTitle") as HTMLInputElement).value;
    const content = (document.getElementById("articleContent") as HTMLTextAreaElement).value;
    console.log(`createArticleSubmit caled with title ${title} and content ${content}`);
    try {
      await axios.post(
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
    }
    // TODO
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

export default CreatePage;
