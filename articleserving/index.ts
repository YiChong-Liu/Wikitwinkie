import express from "express";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { ArticleStatus, EventType } from "./utils/interfaces.js";
import type { EventBody, ArticleServingResponse } from "./utils/interfaces.js"
import { NLPRoute, NLPEventListenerRouteConfig } from "./utils/utils.js";
import { title } from "process";
// import { generateEvent, NLPRoute } from "./utils/utils.js";

const PORT = 4006;
const EVENT_LISTENERS: EventType[] = [
  EventType.ARTICLE_CREATED
];

interface ArticleServingDBEntry {
  articleId: string,
  title: string,
  content: string,
  status: ArticleStatus
}

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const db = redis.createClient({
  socket: {
    host: "articleservingdb",
    port: 6379
  }
});

app.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

app.post("/events", NLPRoute(NLPEventListenerRouteConfig, async (req, res) => {
  switch (req.body.type) {
    case EventType.ARTICLE_CREATED:
      const data = req.body.data as EventBody<EventType.ARTICLE_CREATED>;
      const dbEntry: ArticleServingDBEntry = {
        articleId: data.articleId,
        title: data.title,
        content: data.content,
        status: ArticleStatus.ACTIVE
      };
      await db.set(data.name, JSON.stringify(dbEntry));
      break;
  }
}));

app.get("/:name", NLPRoute({}, async (req, res) => {
  const articleStr = await db.get(req.params.name)
  if (articleStr === null) {
    res.status(404).end();
    return;
  }
  const article = JSON.parse(articleStr) as ArticleServingDBEntry;
  const responseData: ArticleServingResponse = {
    articleId: article.articleId,
    title: article.title,
    content: article.content,
    status: article.status
  };
  res.status(200).send(responseData);
}));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
