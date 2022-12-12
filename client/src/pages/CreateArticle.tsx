// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import "./CreateArticle.css";

const CreatePage = () => {
  // const navigate = useNavigate();

  const createArticleSubmit = async () => {
    console.log("createArticleSubmit caled");
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
