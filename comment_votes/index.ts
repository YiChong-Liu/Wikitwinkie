// app.get('/posts/:postid/comments/:commentid/votes', (req, res) => {
//   res.send(voteByPostidCommentid[(req.params.postid, req.params.commentid)] || 0);
// });

// app.post('/posts/:postid/comments/:commentid/votes', async (req, res) => {
//   const { vote } = req.body;

//   // Change vote number if there is vote number, set to new vote if there is None
//   const votes = voteByPostidCommentid[(req.params.postid, req.params.commentid)] ? 
//     voteByPostidCommentid[(req.params.postid, req.params.commentid)] + vote : vote;
//   voteByPostidCommentid[(req.params.postid, req.params.commentid)] = votes;

//   await axios.post('http://localhost:4005/events', {
//     type: Type.COMMENT_VOTED,
//     data: {
//         commentId: req.params.commentid,
//         postId: req.params.postid,
//         votes: votes
//     },
//   });

//   console.log(votes);
//   res.status(201).send({votes});
// });

import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { db } from './db';
import { CommentVote, ErrorMessage, instanceOfCommentVote } from './utils';

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const database = new db();

app.get('/articles/:articleId/comments/:commentId/votes', async (req: express.Request, res: express.Response) => {
  const vote: Comment[] | ErrorMessage = await database.getCommentsByArticleId(req.params.articleId);
  if (instanceOfCommentVote(vote)) {
    res.status(201).send(vote);
  }
  else {
    res.status(404).send(vote);
  }
});

app.post('/articles/:articleId/comments/:commentId/votes', async (req: express.Request, res: express.Response) => {
});

app.put('/articles/:articleId/comments/:commentId/votes', async (req: express.Request, res: express.Response) => {
  const vote: CommentVote = { 
    commentId: req.params.commentId,
    articleId: req.params.articleId,
    vote: req.body.vote
  };

  try {
    const data = await database.createComment(vote);
    res.status(200).send(data);
  }
  catch(e) {
    console.log(e)
    res.status(500).send(e);
  }
 
});

app.post('/events', (req: express.Request, res: express.Response) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4403, () => {
  console.log('Listening on 4403');
});
