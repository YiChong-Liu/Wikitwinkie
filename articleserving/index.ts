import express, { response } from "express";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { ArticleStatus, EventType } from "./utils/interfaces.js";
import type { EventBody, ArticleServingResponse } from "./utils/interfaces.js"
import { NLPRoute, NLPEventListenerRouteConfig } from "./utils/utils.js";
// import { generateEvent, NLPRoute } from "./utils/utils.js";

const PORT = 4006;
const EVENT_LISTENERS: EventType[] = [
  EventType.ARTICLE_CREATED,
  EventType.ARTICLE_UPDATED
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
    case EventType.ARTICLE_CREATED: {
      const data = req.body.data as EventBody<EventType.ARTICLE_CREATED>;
      await db.set("names/" + data.articleId, data.name);
      const dbEntry: ArticleServingDBEntry = {
        articleId: data.articleId,
        title: data.title,
        content: data.content,
        status: ArticleStatus.ACTIVE
      };
      console.log(`Saving article to ${"articles/" + data.name} in db`);
      await db.set("articles/" + data.name, JSON.stringify(dbEntry));
      break;
    }
    case EventType.ARTICLE_UPDATED: {
      const data = req.body.data as EventBody<EventType.ARTICLE_UPDATED>;
      const dbEntry: ArticleServingDBEntry = {
        articleId: data.articleId,
        title: data.title,
        content: data.content,
        status: data.status
      };
      if (data.status === ArticleStatus.DELETED) {
        // the article was deleted, meaning it cannot have also been renamed
        // just update the article entry in the database
      } else if (data.status === ArticleStatus.ACTIVE) {
        // we need to check if the article was renamed and update the
        //     names index if it was
        const oldName = await db.get("names/" + data.articleId);
        if (oldName === null) {
          console.error(`Article with ID ${data.articleId} not found;`);
          response.status(400).end();
          return;
        }
        if (data.name !== oldName) {
          await db.set("names/" + data.articleId, data.name);
          await db.del("articles/" + oldName);
        }
      } else {
        throw new Error("Unexpected article status in event");
      }
      await db.set("articles/" + data.name, JSON.stringify(dbEntry));
      break;
    }
  }
}));

app.get("/:name", NLPRoute({}, async (req, res) => {
  // we need to parse originalUrl because req.params.name will parse url encoding,
  //     which we don't want
  const articleName = req.originalUrl.substring(1);

  const articleStr = await db.get("articles/" + articleName)
  if (articleStr === null) {
    res.status(404).send("Article not found\n");
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
