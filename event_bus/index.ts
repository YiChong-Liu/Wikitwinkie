import express = require('express');
import logger = require('morgan');
import axios, { AxiosError } from 'axios';
import  { CommentEvent, IEvent, PostEvent } from './enum'

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.post('/events', (req: express.Request, res: express.Response) => {
  
});

app.listen(2000, () => {
  console.log('Listening on 2000');
});
