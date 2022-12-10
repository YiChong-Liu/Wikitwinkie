import express = require('express');
import logger = require('morgan');
import axios, { AxiosError } from 'axios';
import  { IEvent, Type } from './enum'

const app = express();

app.use(logger('dev'));
app.use(express.json());

function commentEvent(event: IEvent) {
  try {
    axios.post('http://comments:4401/events', event).catch((err: Error | AxiosError) => {
      console.log(err.message);
    });
    axios.post
  }
  catch (err) {
    console.log(err);
  }
 
}

function commentVoteEvent(event: IEvent) {
  try {
    axios.post('http://comment_votes:4403/events', event).catch((err: Error | AxiosError) => {
      console.log(err.message);
    });
  }
  catch (err) {
    console.log(err);
  }
}

app.post('/events', (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;

  commentEvent(event);
  commentVoteEvent(event);

  res.send({});
});

app.listen(2000, () => {
  console.log('Listening on 2000');
});
