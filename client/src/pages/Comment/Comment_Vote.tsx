import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useEffect, useState } from 'react';
import SearchResult from "../SearchResult";

const Comment_Vote = (props: any) => {
  const [Vote,setVote] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    try {
      axios.get( 
        `http://${window.location.hostname}:4403/articles/${props.Comment.articleId}/comments/${props.Comment.commentId}/votes`,
        {withCredentials: true}
      ).then(response => {
        setVote(response.data.vote);
        setLoading(false);
      });
    }
    catch(e) {
      console.log(e);
    }
    
  }, []);

  if (isLoading) {
    return <div>Loading Votes...</div>;
  }

  const upVote = async () => {
    const response = await axios.put(
        `http://${window.location.hostname}:4403/articles/${props.Comment.articleId}/comments/${props.Comment.commentId}/votes`,
        { vote: 1 },
        {withCredentials: true}
    );
    setVote(response.data.vote);
  }
  const downVote = async() => {
    const response = await axios.put(
        `http://${window.location.hostname}:4403/articles/${props.Comment.articleId}/comments/${props.Comment.commentId}/votes`,
        { vote: -1 },
        {withCredentials: true}
    );
    setVote(response.data.vote);
  }

  return <div id="comment-vote">
    <span>Vote: {Vote} </span>
    <div>
      <button type="button" className="btn btn-outline-primary" onClick={upVote}>Up vote</button>
      <button type="button" className="btn btn-outline-danger" onClick={downVote}>Down vote</button>
    </div>
  </div>;
}

export default Comment_Vote;
