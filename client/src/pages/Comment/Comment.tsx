import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../../lib/NLPPage";
import { useState } from 'react';
import Comment_Vote from "./Comment_Vote";

const Comment = (props: any) => {
    const [Comment,setComment] = useState(props.Commemt.vote);


  return <div>
    <Comment_Vote vote={props.x}></Comment_Vote>
  </div>;
}

export default Comment;
