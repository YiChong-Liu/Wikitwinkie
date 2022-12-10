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
app.get('/search/:content', async (req: express.Request, res: express.Response) => {
  
});

// Inverted indexing
app.post('/search/indexing', async (req: express.Request, res: express.Response) => {
  
});

app.post('/events', (req: express.Request, res: express.Response) => {
  
  res.send({});
});

app.listen(4405, () => {
  console.log('Listening on 4405');
});
