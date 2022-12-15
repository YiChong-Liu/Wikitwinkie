import express from 'express';
import logger from 'morgan';
import cors from 'cors';
// import axios from 'axios';
import { randomBytes } from 'crypto';
import cookieParser from "cookie-parser";
import { Comment, CommentKey, EventType, IEvent } from './utils/interfaces.js';
import { generateEvent } from './utils/utils.js';
import { ErrorMessage, instaceOfErrorMessage, instanceOfComment } from './commentsUtils.js';
import { db } from './db.js';

const EVENT_LISTENERS: EventType[] = [
  EventType.ARTICLE_CREATED
];

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const database = new db();

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

// GET COMMENT BY ARTICLE ID
app.get('/articles/:articleId/comments', async (req: express.Request, res: express.Response) => {
  const comment: Comment[] | ErrorMessage = await database.getCommentsByArticleId(req.params.articleId);

  if (!instaceOfErrorMessage(comment)) {
    let isComment = true;
    comment.forEach(element => {
      isComment = instanceOfComment(element) && isComment;
    });
    if (isComment) {
      res.status(201).send(comment);
    }
    else {
      res.status(404).send(comment);
    }
  }
  else {
    res.status(404).send(comment);
  }


  await generateEvent(EventType.COMMENT_GET, comment);
});

// GENERATE COMMENT
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

  await generateEvent(EventType.COMMENT_CREATED, comment);
});

// EDIT COMMENT
app.put('/articles/:articleId/comments/:commentId', async (req: express.Request, res: express.Response) => {
  const comment: Comment = {
    commentId: req.params.commentId,
    content: req.body.content,
    articleId: req.params.articleId,
    username: req.body.username
  };

  try {
    const data = await database.editComment(comment);
    res.status(200).send(data);
  }
  catch(e) {
    console.log(e)
    res.status(500).send(e);
  }

  await generateEvent(EventType.COMMENT_EDITED, comment);
});

// DELETE COMMENT
app.post('/articles/:articleId/comments/:commentId', async (req: express.Request, res: express.Response) => {
  const key: CommentKey = {
    articleId: req.params.articleId,
    commentId: req.params.commentId
  }
  try {
    const data = await database.deleteComment(key);
    res.status(200).send(data);
  }
  catch(e) {
    console.log(e)
    res.status(500).send(e);
  }

  await generateEvent(EventType.COMMENT_DELETED, key);
});


app.post('/events', (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;
  res.send({});
});

app.listen(4401, () => {
  console.log('Listening on 4401');
});
