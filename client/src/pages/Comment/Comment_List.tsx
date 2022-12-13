import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useState } from 'react';
import Comment_Vote from "./Comment_Vote";
import { CommentReponse } from "../../utils/interfaces";

const Comment_List = (props: any) => {

  // const renderedComments = props.Comment.Comment.map(x => {
  //   return <li key={x.username}>{x.content}</li>;
  // });

  return <div></div>;
    // <ul>{renderedComments}</ul>;
}

export default Comment_List;
