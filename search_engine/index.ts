import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { db } from './db.js';
import { EventType } from "./utils/interfaces.js";
import type { IEvent } from './utils/interfaces.js';

const EVENT_LISTENERS: EventType[] = [
  EventType.ARTICLE_CREATED
];

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const database = new db();

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

// Search by article content
app.post('/search/:content', async (req: express.Request, res: express.Response) => {
  try {
    res.status(200).send(await database.searchContent(req.params.content));
  }
  catch(e) {
    res.status(404).send( { message: e });
  }
});

// Inverted indexing
app.post('/search/indexing', async (req: express.Request, res: express.Response) => {
  console.log("outer");
  try {
    console.log("inner");
    console.log(req.body);
    res.status(200).send(await database.indexing(req.body));
    return;
  }
  catch(e) {
    res.status(404).send( { message: e });
  }
});

app.post('/events', async (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;
  switch (event.type) {
    case EventType.ARTICLE_CREATED:
      try {
        res.status(200).send(await database.indexing(event.data));
        return;
      }
      catch(e) {
        res.status(404).send( { message: e });
        return;
      }
  }
  res.send({});
});

app.listen(4405, () => {
  console.log('Listening on 4405');
});
