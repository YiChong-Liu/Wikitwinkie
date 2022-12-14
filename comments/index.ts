import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { Comment, CommentKey, ErrorMessage, instaceOfErrorMessage, instanceOfComment } from './commentsUtils.js';
import { db } from './db.js';
import { EventType, IEvent } from './utils/interfaces.js';
import cookieParser from "cookie-parser";

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
  

  const payload = {
    type: EventType.COMMENT_GET,
    data: comment
  }
  await axios.post('http://eventbus:2000/events', payload);
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

  const payload = {
    type: EventType.COMMENT_CREATED,
    data: comment
  }
  await axios.post('http://eventbus:2000/events', payload);
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

  const payload = {
    type: EventType.COMMENT_EDITED,
    data: comment
  }
  await axios.post('http://eventbus:2000/events', payload);
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

  const payload = {
    type: EventType.COMMENT_DELETED,
    data: key
  }
  await axios.post('http://eventbus:2000/events', payload);
});


app.post('/events', (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;
  // switch (event.type) {
  //   case EventType.ARTICLE_CREATED:
  //     const articleId: string = event.data.articleId, commentId: string = event.data.commentId;
  //     axios.post(`http://localhost:4401/articles/:articleId/comments`, event.data).catch((err: Error) => {
  //       console.log("FAIL TO INIT");
  //     });
  // }

  res.send({});
});

app.listen(4401, () => {
  console.log('Listening on 4401');
});
