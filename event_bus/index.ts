import express from "express";
import logger from "morgan";
import axios, { AxiosError } from "axios";
import type { IEvent } from "./utils/interfaces.js";

const PORT = 2000;
const app = express();
app.use(logger("dev"));
app.use(express.json());

function commentEvent(event: IEvent) {
  try {
    axios.post("http://comments:4401/events", event).catch((err: Error | AxiosError) => {
      console.log(err.message);
    });
    axios.post
  } catch (err) {
    console.log(err);
  }

}

function commentVoteEvent(event: IEvent) {
  try {
    axios.post("http://comment_votes:4403/events", event).catch((err: Error | AxiosError) => {
      console.log(err.message);
    });
  } catch (err) {
    console.log(err);
  }
}

app.post("/events", (req: express.Request, res: express.Response) => {
  const event: IEvent = req.body;

  commentEvent(event);
  commentVoteEvent(event);

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
