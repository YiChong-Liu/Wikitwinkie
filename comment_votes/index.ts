import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { db } from './db.js';
import { CommentVote, ErrorMessage, instanceOfCommentVote, VoteKey } from './utils.js';
import { EventType } from './utils/interfaces.js';
import type { IEvent } from './utils/interfaces.js';

const EVENT_LISTENERS: EventType[] = [
  EventType.COMMENT_CREATED
];

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const database = new db();

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

// GET COMMENT VOTE
app.get('/articles/:articleId/comments/:commentId/votes', async (req: express.Request, res: express.Response) => {
  const key: VoteKey = { 'articleId': req.params.articleId, 'commentId': req.params.commentId }
  const vote: CommentVote | ErrorMessage = await database.getVoteById(key);

  if (instanceOfCommentVote(vote)) {
    res.status(201).send(vote);
  }
  else {
    res.status(404).send(vote);
  }

  const payload: IEvent = {
    type: EventType.COMMENT_VOTE_GET,
    data: vote
  }
  await axios.post('http://eventbus:2000/events', payload);
});

// INIT COMMENT VOTE
app.post('/articles/:articleId/comments/:commentId/votes', async (req: express.Request, res: express.Response) => {
  const key: VoteKey = { 'articleId': req.params.articleId, 'commentId': req.params.commentId }
  const vote: CommentVote | ErrorMessage = await database.initVote(key);

  if (instanceOfCommentVote(vote)) {
    res.status(201).send(vote);
  }
  else {
    res.status(404).send(vote);
  }

  const payload: IEvent = {
    type: EventType.COMMENT_VOTE_INIT,
    data: vote
  }
  await axios.post('http://eventbus:2000/events', payload);
});

// EDIT COMMENT VOTE
app.put('/articles/:articleId/comments/:commentId/votes', async (req: express.Request, res: express.Response) => {
  const key: VoteKey = { 'articleId': req.params.articleId, 'commentId': req.params.commentId }
  let data: CommentVote | ErrorMessage = { message: 'Failed' };
  try {
    data = await database.updateVote(key, req.body.vote);
    res.status(200).send(data);
  }
  catch(e) {
    console.log(e);
    res.status(500).send(e);
  }

  const payload: IEvent = {
    type: EventType.COMMENT_VOTE_CHANGED,
    data: data
  }
  await axios.post('http://eventbus:2000/events', payload);
});

app.post('/events', (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;
  switch (event.type) {
    case EventType.COMMENT_CREATED:
      const comment_vote: CommentVote = {
        articleId: event.data.articleId,
        commentId: event.data.commentId,
        vote: 0
      }

      if (instanceOfCommentVote(comment_vote)) {
        const articleId: string = event.data.articleId, commentId: string = event.data.commentId;
        axios.post(`http://localhost:4403/articles/${articleId}/comments/${commentId}/votes`, event).catch((err: Error) => {
          console.log("FAIL TO INIT");
        });
      }
      else {
        res.status(500).send("Invalid CommentVote Data");
        return;
      }
  }

  res.send({});
});

app.listen(4403, () => {
  console.log('Listening on 4403');
});
