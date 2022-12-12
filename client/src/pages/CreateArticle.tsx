import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import "./CreateArticle.css";

const CreatePage = () => {
  // const navigate = useNavigate();

  const createArticleSubmit = async () => {
    const title = (document.getElementById("articleTitle") as HTMLInputElement).value;
    const content = (document.getElementById("articleContent") as HTMLTextAreaElement).value;
    console.log(`createArticleSubmit caled with title ${title} and content ${content}`);
    await axios.post(
      `http://${window.location.hostname}:4005/create`,
      { // body
        title: title,
        content: content
      },
      {withCredentials: true} // send and/or set cookies
    );
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
  </NLPPage>;
}

export default CreatePage;
