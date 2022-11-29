// import express = require('express');
// import logger = require('morgan');
// import cors = require('cors');
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { CommentData, Type } from './utils';

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const commentsByPostId: { [key: string]: CommentData[]} = {};

app.get('/posts/:id/comments', (req: express.Request, res: express.Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req: express.Request, res: express.Response) => {
  const comment: CommentData = { 
    id: randomBytes(4).toString('hex'),
    content: req.body.content,
    postId: req.params.id
  };
  const comments = commentsByPostId[req.params.id] || [];

  if (comment.content === undefined) {
    res.status(500).send("No content value");
    return;
  }
  
  comments.push(comment);
  commentsByPostId[req.params.id] = comments;

  const payload = {
    type: Type.COMMENT_CREATED,
    data: comment
  }
  await axios.post('http://eventbus:4005/events', payload);

  res.status(201).send(comments);
});

app.post('/events', (req: express.Request, res: express.Response) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
