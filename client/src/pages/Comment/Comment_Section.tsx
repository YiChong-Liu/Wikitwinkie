import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useState } from 'react';
import { CommentReponse } from "../../utils/interfaces";
import Comment_List from "./Comment_List";

const Comment_Section = (props: any) => {
    const [Comments, setComments] = useState();
    console.log(props);

    const postComment = async () => {
        const content: HTMLInputElement = (document.getElementById("comment-bar") as HTMLInputElement);
        await axios.post(
            `http://${window.location.hostname}:4401/articles/${props.articleName}/comments`,
            {
                content: content.value,
                articleId: props.articleName,
                username: "John Doe"
            },
            {withCredentials: true}
        );

        const response: AxiosResponse<CommentReponse> = await axios.get( 
          `http://${window.location.hostname}:4401/articles/${props.articleName}/comments`,
          {withCredentials: true}
        );

        console.log(response);
        // setComments(response.data);
    }

  return <div id="comment-section">

    <div className="input-group mb-3">
      <input type="text" className="form-control" id="comment-bar" placeholder="Type comment here..."/>
      <div className="input-group-append">
        <button type="button" className="btn btn-outline-secondary" onClick={postComment}>Post Comment</button>
      </div>
    </div>
    <Comment_List Comment={ Comment }></Comment_List>
  </div>;
}

export default Comment_Section;
