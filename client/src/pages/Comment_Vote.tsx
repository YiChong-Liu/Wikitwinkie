import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import { useState } from 'react';
import SearchResult from "./SearchResult";

const Comment_Vote = (props: any) => {
  const [Vote,setVote] = useState(props.Commemt.vote);

  const upVote = async () => {
    const response = await axios.post(
        `http://${window.location.hostname}:4403/articles/${props.Comment.articleId}/comments/${props.Comment.commentId}`,
        { vote: 1 },
        {withCredentials: true}
    );
    setVote(response.data.vote);
  }
  const downVote = async() => {
    const response = await axios.post(
        `http://${window.location.hostname}:4403/articles/${props.Comment.articleId}/comments/${props.Comment.commentId}`,
        { vote: -1 },
        {withCredentials: true}
    );
    setVote(response.data.vote);
  }
  
  return <div id="comment-vote">
    <span>Vote: {Vote}</span>
    <button type="button" class="btn btn-outline-primary" onClick={upVote}>Up vote</button>
    <button type="button" class="btn btn-outline-danger" onClick={downVote}>Down vote</button>
  </div>;
}

export default Comment_Vote;
