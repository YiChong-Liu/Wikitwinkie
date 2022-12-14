import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useState } from 'react';
import Comment_Vote from "./Comment_Vote";
import { CommentReponse } from "../../utils/interfaces";

const Comment_List = (props: any) => {
  const comments: CommentReponse[] = props.Comment;

  const renderedComments = comments.map(x => {
    return <li className="list-group-item" key={x.username}>
        <div>Username: {x.username}</div>
        <div>{x.content}</div>
      </li>;
  });

  return <ul className="list-group">{renderedComments}</ul>;
  
    
}

export default Comment_List;
