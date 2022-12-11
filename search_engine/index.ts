import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { db } from './db';

const app: express.Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const database = new db();

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
  try {
    res.status(200).send(await database.indexing(req.body));
  }
  catch(e) {
    res.status(404).send( { message: e });
  }
});

app.post('/events', (req: express.Request, res: express.Response) => {
  
  res.send({});
});

app.listen(4405, () => {
  console.log('Listening on 4405');
});
