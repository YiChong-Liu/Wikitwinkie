import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { ArticleStatus, EventType } from "./utils/interfaces.js";
import type { ArticleCreateResponse } from "./utils/interfaces.js";
import { generateEvent, NLPRoute } from "./utils/utils.js";

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

const getArticleId = (title: string) =>
  encodeURIComponent(title).replace("_", "%5F").replace("%20", "_");

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

app.post("/create", NLPRoute({
  bodySchema: {
    properties: {
      title: { type: "string" },
      content: { type: "string" }
    }
  },
  sessionCookie: "required"
} as const, async (req, res, NLPParams) => {
  const articleId = getArticleId(req.body.title);
  console.log(`Create article called with title ${req.body.title} and content ${req.body.content}`);
  // TODO: validate content
  await db.set(articleId, JSON.stringify({
    history: [{
      author: NLPParams.username, // TODO
      name: articleId, // TODO: change this to allow changing name
      title: req.body.title,
      content: req.body.content,
      utc_datetime: new Date().toISOString(),
      status: ArticleStatus.ACTIVE
    }],
    comments: []
  }));
  generateEvent(EventType.ARTICLE_CREATED, {
    articleId: articleId,
    author: NLPParams.username,
    name: articleId, // TODO: change this to allow changing name
    title: req.body.title,
    content: req.body.content
  });
  const responseData: ArticleCreateResponse = {
    name: articleId
  };
  res.status(200).send();
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
} as const, async (req, res) => {
  console.log(`Article edit called with articleId ${req.body.articleId}, title ${req.body.title}, content ${req.body.content}`);
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
} as const, async (req, res) => {
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
} as const, async (req, res) => {
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
