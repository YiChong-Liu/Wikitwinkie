// import axios from "axios";
// import type { AxiosResponse } from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import NLPPage from "../../lib/NLPPage";
// import { useState } from 'react';
import Comment_Vote from "./Comment_Vote";
import { CommentResponse } from "../../utils/interfaces";

const Comment_List = (props: any) => {
  const comments: CommentResponse[] = props.Comment;

  const renderedComments = comments.map(x => {
    return <li className="list-group-item" key={x.commentId}>
        <div>Username: <b>{x.username}</b></div>
        <div>{x.content}</div>

        <Comment_Vote Comment={x}></Comment_Vote>
      </li>;
  });

  return <ul className="list-group">{renderedComments}</ul>;


}

export default Comment_List;
