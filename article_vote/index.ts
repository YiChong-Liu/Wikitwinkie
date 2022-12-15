import redis from "redis"
import express from "express";
import logger from "morgan";
import cors from "cors";
import { db } from './db.js';
import { ArticleVote, ErrorMessage, instanceOfArticleVote, VoteKey } from './newUtils.js';
import { EventType } from './utils/interfaces.js';
import type { IEvent } from './utils/interfaces.js';
import axios from 'axios';

const EVENT_LISTENERS: EventType[] = [
    EventType.ARTICLE_CREATED
];
const app = express();
const PORT = 4004;

app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const database = new db();

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

// GET ARTICLE VOTE
app.get('/articles/:articleId/vote', async (req: express.Request, res: express.Response) => {
  const key: VoteKey = { 'articleId': req.params.articleId}
  const vote: ArticleVote | ErrorMessage = await database.getVoteById(key);

  if (instanceOfArticleVote(vote)) {
    res.status(201).send(vote);
  }
  else {
    res.status(404).send(vote);
  }

  const payload: IEvent = {
    type: EventType.ARTICLE_VOTE_GET,
    data: vote
  }
  await axios.post('http://eventbus:2000/events', payload);
});

// INIT ARTICLE VOTE
app.post('/articles/:articleId/vote', async (req: express.Request, res: express.Response) => {
  const key: VoteKey = { 'articleId': req.params.articleId}
  const vote: ArticleVote | ErrorMessage = await database.initVote(key);

  if (instanceOfArticleVote(vote)) {
    res.status(201).send(vote);
  }
  else {
    res.status(404).send(vote);
  }

  const payload: IEvent = {
    type: EventType.ARTICLE_VOTE_INIT,
    data: vote
  }
  await axios.post('http://eventbus:2000/events', payload);
});

// EDIT ARTICLE VOTE
app.put('/articles/:articleId/vote', async (req: express.Request, res: express.Response) => {
  const key: VoteKey = { 'articleId': req.params.articleId }
  let data: ArticleVote | ErrorMessage = { message: 'Failed' };
  try {
    data = await database.updateVote(key, req.body.vote);
    res.status(200).send(data);
  }
  catch(e) {
    console.log(e);
    res.status(500).send(e);
  }

  const payload: IEvent = {
    type: EventType.ARTICLE_VOTE_CHANGED,
    data: data
  }
  await axios.post('http://eventbus:2000/events', payload);
});

app.post('/events', async (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;
  switch (event.type) {
    case EventType.ARTICLE_CREATED:
      const article_vote: ArticleVote = {
        articleId: event.data.articleId,
        vote: 0
      }

      if (instanceOfArticleVote(article_vote)) {
        const articleId: string = event.data.articleId;
        const key: VoteKey = { 'articleId': articleId};
        console.log(key);
        const vote: ArticleVote | ErrorMessage = await database.initVote(key);

        if (instanceOfArticleVote(vote)) {
          res.status(201).send(vote);
          return;
        }
        else {
          res.status(404).send(vote);
          return;
        }
      }
      else {
        res.status(500).send("Invalid ArticleVote Data");
        return;
      }
  }

  res.send({});
});



app.listen(4004, () => {
    console.log('Listening on 4004');
});
  