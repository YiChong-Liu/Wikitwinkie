import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NLPPage from "../../lib/NLPPage";
import { useEffect, useState } from 'react';
import { CommentReponse } from "../../utils/interfaces";
import Comment_List from "./Comment_List";

const Comment_Section = (props: any) => {
    const [isLoading, setLoading] = useState(true);
    const [comments, setComments] = useState();

    useEffect(() => {
      try {
        axios.get( 
          `http://${window.location.hostname}:4401/articles/${props.articleName}/comments`,
          {withCredentials: true}
        ).then(response => {
          setComments(response.data);
          setLoading(false);
        });
      }
      catch(e) {
        console.log(e);
      }
      
    }, []);
  
    if (isLoading) {
      return <div>Loading Comments...</div>;
    }

    const postComment = async () => {
        const content: HTMLInputElement = (document.getElementById("comment-bar") as HTMLInputElement);
        await axios.post(
            `http://${window.location.hostname}:4401/articles/${props.articleName}/comments`,
            {
                content: content.value,
                articleId: props.articleName,
                username: Cookies.get("username") || "Anonymous"
            },
            {withCredentials: true}
        );

        const response = await axios.get( 
          `http://${window.location.hostname}:4401/articles/${props.articleName}/comments`,
          {withCredentials: true}
        );
        setComments(response.data);

        content.value = "";
    }

  return <div id="comment-section">

    <div className="input-group mb-3">
      <input type="text" className="form-control" id="comment-bar" placeholder="Type comment here..."/>
      <div className="input-group-append">
        <button type="button" className="btn btn-outline-secondary" onClick={postComment}>Post Comment</button>
      </div>
    </div>
    <Comment_List Comment={ comments }></Comment_List>
  </div>;
}

export default Comment_Section;
