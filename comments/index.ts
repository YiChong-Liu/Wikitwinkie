import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { Comment, CommentReq, ErrorMessage, instaceOfErrorMessage, instanceOfComment } from './utils';
import { db } from './db';

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const commentsByPostId: { [key: string]: Comment[]} = {};
const database = new db();

// app.get('/articles/:articleId/comments/:commentId', async (req: express.Request, res: express.Response) => {
//   const comment: Comment | ErrorMessage = await db.getCommentByIds(req.params.postId, req.params.commentId);
//   if (instanceOfComment(comment)) {
//     res.status(201).send(comment);
//   }
//   else {
//     res.status(404).send(comment);
//   }
// });

app.get('/articles/:articleId/comments', async (req: express.Request, res: express.Response) => {
  const comment: Comment[] | ErrorMessage = await database.getCommentsByArticleId(req.params.articleId);
  if (instanceOfComment(comment)) {
    res.status(201).send(comment);
  }
  else {
    res.status(404).send(comment);
  }
});

app.post('/articles/:articleId/comments', async (req: express.Request, res: express.Response) => {
  const comment: Comment = { 
    commentId: randomBytes(4).toString('hex'),
    content: req.body.content,
    articleId: req.params.articleId,
    username: req.body.username
  };

  try {
    const data = await database.createComment(comment);
    res.status(200).send(data);
  }
  catch(e) {
    console.log(e)
    res.status(500).send(e);
  }
  
  
  // const comments = commentsByPostId[req.params.id] || [];

  // if (comment.content === undefined) {
  //   res.status(500).send("No content value");
  //   return;
  // }
  
  // comments.push(comment);
  // commentsByPostId[req.params.id] = comments;

  // const payload = {
  //   type: Type.COMMENT_CREATED,
  //   data: comment
  // }
  // await axios.post('http://eventbus:4005/events', payload);

  // res.status(201).send(comments);
});

app.post('/events', (req: express.Request, res: express.Response) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4401, () => {
  console.log('Listening on 4401');
});
