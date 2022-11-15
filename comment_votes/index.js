import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { Type } from '../enum.js'

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const voteByPostidCommentid = {};

app.get('/posts/:postid/comments/:commentid/votes', (req, res) => {
  res.send(voteByPostidCommentid[(req.params.postid, req.params.commentid)] || 0);
});

app.post('/posts/:postid/comments/:commentid/votes', async (req, res) => {
  const { vote } = req.body;

  // Change vote number if there is vote number, set to new vote if there is None
  const votes = voteByPostidCommentid[(req.params.postid, req.params.commentid)] ? 
    voteByPostidCommentid[(req.params.postid, req.params.commentid)] + vote : vote;
  voteByPostidCommentid[(req.params.postid, req.params.commentid)] = votes;

  await axios.post('http://localhost:4005/events', {
    type: Type.COMMENT_VOTED,
    data: {
        commentId: req.params.commentid,
        postId: req.params.postid,
        votes: votes
    },
  });

  console.log(votes);
  res.status(201).send({votes});
});

app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4004, () => {
  console.log('Listening on 4004');
});
