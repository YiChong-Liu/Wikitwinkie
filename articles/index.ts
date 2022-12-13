import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { ArticleStatus, EventType } from "./utils/interfaces.js";
import type { ArticleCreateResponse, ArticleEditResponse } from "./utils/interfaces.js";
import { generateEvent, NLPRoute } from "./utils/utils.js";

const PORT = 4005;
const EVENT_LISTENERS: EventType[] = [];

interface ArticlesDBEntry {
  history: {
    author: string,
    name: string,
    title: string,
    content: string,
    utc_datetime: string,
    status: ArticleStatus
  }[],
  comments: string[]
}

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

const getArticleName = (title: string) =>
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
  const articleName = getArticleName(req.body.title);
  const articleId = articleName; // TODO: change this
  // TODO: validate content
  const dbEntry: ArticlesDBEntry = {
    history: [{
      author: NLPParams.username!,
      name: articleName,
      title: req.body.title,
      content: req.body.content,
      utc_datetime: new Date().toISOString(),
      status: ArticleStatus.ACTIVE
    }],
    comments: []
  };
  await db.set(articleId, JSON.stringify(dbEntry));
  generateEvent(EventType.ARTICLE_CREATED, {
    articleId: articleId,
    author: NLPParams.username!,
    name: articleName,
    title: req.body.title,
    content: req.body.content
  });
  const responseData: ArticleCreateResponse = {
    name: articleName
  };
  res.status(200).send(responseData);
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
} as const, async (req, res, NLPParams) => {
  console.log(`Article edit called with articleId ${req.body.articleId}, title ${req.body.title}, content ${req.body.content}`);
  const articleStr = await db.get(req.body.articleId);
  if (articleStr === null) {
    res.status(400).send("Article not found\n");
    return;
  }
  const articleName = getArticleName(req.body.title);

  // update database
  const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
  dbEntry.history.push({
    author: NLPParams.username!,
    name: articleName,
    title: req.body.title,
    content: req.body.content,
    utc_datetime: new Date().toISOString(),
    status: ArticleStatus.ACTIVE
  })
  await db.set(req.body.articleId, JSON.stringify(dbEntry));

  // generate event
  generateEvent(EventType.ARTICLE_UPDATED, {
    articleId: req.body.articleId,
    author: NLPParams.username!,
    name: articleName,
    title: req.body.title,
    content: req.body.content
  });

  // return HTTP response
  const responseData: ArticleEditResponse = {
    name: articleName
  };
  res.status(200).send(responseData);
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
