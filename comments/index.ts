import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { Comment, ErrorMessage, instanceOfComment, Type } from './utils';
import { db } from './db';

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const database = new db();

app.get('/articles/:articleId/comments', async (req: express.Request, res: express.Response) => {
  const comment: Comment[] | ErrorMessage = await database.getCommentsByArticleId(req.params.articleId);
  if (instanceOfComment(comment)) {
    res.status(201).send(comment);
  }
  else {
    res.status(404).send(comment);
  }

  const payload = {
    type: Type.COMMENT_GET,
    data: comment
  }
  await axios.post('http://eventbus:2000/events', payload);
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
 
  const payload = {
    type: Type.COMMENT_CREATED,
    data: comment
  }
  await axios.post('http://eventbus:2000/events', payload);
});

app.post('/events', (req: express.Request, res: express.Response) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4401, () => {
  console.log('Listening on 4401');
});
