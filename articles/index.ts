import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import type { EventType } from "./utils/interfaces.js";
import { NLPRoute } from "./utils/utils.js";

const PORT = 4005;
const EVENT_LISTENERS: EventType[] = [];

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const db = redis.createClient({
  socket: {
    host: "articlesdb",
    port: 6379
  }
});

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

app.post("/create", NLPRoute({
  bodySchema: {
    properties: {
      articleId: { type: "string" },
      title: { type: "string" },
      content: { type: "string" }
    }
  },
  sessionCookie: "required"
}, async (req, res) => {
  // TODO
  res.status(200).end();
}));

app.post("/edit", NLPRoute({
  bodySchema: {
    properties: {
      articleId: { type: "string" },
      title: { type: "string" },
      content: { type: "string" }
    }
  },
  sessionCookie: "required"
}, async (req, res) => {
  // TODO
  res.status(200).end();
}));

app.post("/delete", NLPRoute({
  bodySchema: {
    properties: {
      articleId: { type: "string" },
      title: { type: "string" },
      content: { type: "string" }
    }
  },
  sessionCookie: "required"
}, async (req, res) => {
  // TODO
  res.status(200).end();
}));

app.post("/restore", NLPRoute({
  bodySchema: {
    properties: {
      articleId: { type: "string" },
      title: { type: "string" },
      content: { type: "string" }
    }
  },
  sessionCookie: "required"
}, async (req, res) => {
  // TODO
  res.status(200).end();
}));

app.get("/:name/comments", NLPRoute({}, async (req, res) => {
  console.log(req.params.name);
  // TODO
  res.status(200).end();
}));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
