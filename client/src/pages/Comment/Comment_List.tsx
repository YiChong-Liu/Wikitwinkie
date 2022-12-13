import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useState } from 'react';
import Comment_Vote from "./Comment_Vote";
import { Comment } from "../../utils/interfaces";

const Comment_List = async (props: any) => {
  const response: Comment[] = await axios.post(
    `http://${window.location.hostname}:4401/articles/:articleId/comments`,
    {withCredentials: true}
  );

  const renderedComments = response.map((comment) => {
    return <li key={comment.username}>{comment.content}</li>;
  });

  return 
    <ul>{renderedComments}</ul>;
}

export default Comment_List;
