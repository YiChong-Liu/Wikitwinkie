import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { Comment, db } from './utils';

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const commentsByPostId: { [key: string]: Comment[]} = {};

app.get('/posts/:id/comments', async (req: express.Request, res: express.Response) => {
  const comment = await db.getCommentByID(req.params.id);
  res.status(201).send(comment);
});

app.post('/posts/:id/comments', async (req: express.Request, res: express.Response) => {
  const comment: Comment = req.body;
  await db.createComment(comment);
  res.status(200).send(comment);
  // const comment: Comment = { 
  //   commentId: randomBytes(4).toString('hex'),
  //   content: req.body.content,
  //   articleId: req.params.id,
  //   username: req.body.username
  // };
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
