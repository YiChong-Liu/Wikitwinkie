import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useState } from 'react';
import Comment_List from "./Comment_List";

const Comment_Section = (props: any) => {
    const [Comment,setComment] = useState([]);

    const postComment = async () => {
        const content: string = (document.getElementById("comment-bar") as HTMLInputElement).value;
        const response = await axios.post(
            `http://${window.location.hostname}:4401/articles/${props.articleId.articleName}/comments`,
            {
                content: content,
                articleId: props.Article.articleId,
                username: props.Article.username
            },
            {withCredentials: true}
        );

        setComment(props.Article.articleId);
    }

  return <div id="comment-section">

    <div className="input-group mb-3">
      <input type="text" className="form-control" id="comment-bar" placeholder="Type comment here..."/>
      <div className="input-group-append">
        <button type="button" className="btn btn-outline-secondary" onClick={postComment}>Post Comment</button>
      </div>
    </div>

    {/* <Comment_List NewComment={ Comment }></Comment_List> */}
  </div>;
}

export default Comment_Section;
