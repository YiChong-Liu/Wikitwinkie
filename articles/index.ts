import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { ArticleStatus, EventType } from "./utils/interfaces.js";
import type { ArticleCreateResponse, ArticleEditResponse } from "./utils/interfaces.js";
import { generateEvent, listenToEvents, NLPRoute } from "./utils/utils.js";

const PORT = 4005;

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

listenToEvents(app, {
  [EventType.COMMENT_CREATED]: async data => {
    const articleStr = await db.get(data.articleId);
    if (articleStr === null) {
      throw new Error("Article not found\n");
    }

    // update database
    const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
    dbEntry.comments.push(data.commentId);
    await db.set(data.articleId, JSON.stringify(dbEntry));
  },
  [EventType.COMMENT_DELETED]: async data => {
    const articleStr = await db.get(data.articleId);
    if (articleStr === null) {
      throw new Error("Article not found\n");
    }

    // update database
    const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
    const commentIndex = dbEntry.comments.indexOf(data.commentId);
    if (commentIndex == -1) {
      // comment not found, already deleted so ignore
      return;
    }
    dbEntry.comments.splice(commentIndex, 1);
    await db.set(data.articleId, JSON.stringify(dbEntry));
  }
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
      author: NLPParams.username,
      name: articleName,
      title: req.body.title,
      content: req.body.content,
      utc_datetime: new Date().toISOString(),
      status: ArticleStatus.ACTIVE
    }],
    comments: []
  };
  await db.set(articleId, JSON.stringify(dbEntry));
  await generateEvent(EventType.ARTICLE_CREATED, {
    articleId: articleId,
    author: NLPParams.username,
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
    res.status(404).send("Article not found\n");
    return;
  }
  const articleName = getArticleName(req.body.title);

  // update database
  const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
  dbEntry.history.push({
    author: NLPParams.username,
    name: articleName,
    title: req.body.title,
    content: req.body.content,
    utc_datetime: new Date().toISOString(),
    status: ArticleStatus.ACTIVE
  })
  await db.set(req.body.articleId, JSON.stringify(dbEntry));

  // generate event
  await generateEvent(EventType.ARTICLE_UPDATED, {
    articleId: req.body.articleId,
    author: NLPParams.username,
    name: articleName,
    title: req.body.title,
    content: req.body.content,
    status: ArticleStatus.ACTIVE
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
      articleId: { type: "string" }
    }
  },
  sessionCookie: "required"
} as const, async (req, res, NLPParams) => {
  console.log(`Article delete called on articleId ${req.body.articleId}`);
  const articleStr = await db.get(req.body.articleId);
  if (articleStr === null) {
    res.status(404).send("Article not found\n");
    return;
  }

  // update database
  const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
  const lastHistoryEnty = dbEntry.history[dbEntry.history.length - 1];
  if (lastHistoryEnty.status === ArticleStatus.DELETED) {
    // article is already deleted, can't delete it again
    // don't return error though, so the client thinks the article is deleted
    //     (which it is)
    res.status(204).end();
    return;
  }
  dbEntry.history.push({
    author: NLPParams.username,
    name: lastHistoryEnty.name,
    title: lastHistoryEnty.title,
    content: "",
    utc_datetime: new Date().toISOString(),
    status: ArticleStatus.DELETED
  })
  await db.set(req.body.articleId, JSON.stringify(dbEntry));

  // generate event
  await generateEvent(EventType.ARTICLE_UPDATED, {
    articleId: req.body.articleId,
    author: NLPParams.username,
    name: lastHistoryEnty.name,
    title: lastHistoryEnty.title,
    content: "",
    status: ArticleStatus.DELETED
  });

  // return HTTP response
  res.status(204).end();
}));

app.post("/restore", NLPRoute({
  bodySchema: {
    properties: {
      articleId: { type: "string" }
    }
  },
  sessionCookie: "required"
} as const, async (req, res, NLPParams) => {
  console.log(`Article restore called on articleId ${req.body.articleId}`);
  const articleStr = await db.get(req.body.articleId);
  if (articleStr === null) {
    res.status(404).send("Article not found\n");
    return;
  }

  // update database
  const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
  const lastHistoryEnty = dbEntry.history[dbEntry.history.length - 1];
  if (lastHistoryEnty.status === ArticleStatus.ACTIVE) {
    // article is not deleted, can't restore it
    // don't return error though, so the client thinks the article is
    //     not deleted (which is true)
    res.status(204).end();
    return;
  }
  const secondLastHistoryEnty = dbEntry.history[dbEntry.history.length - 2];
  if (secondLastHistoryEnty === undefined || secondLastHistoryEnty.status !== ArticleStatus.ACTIVE) {
    throw new Error("Unexpected error getting previous article state for restore");
  }
  dbEntry.history.push({
    author: NLPParams.username,
    name: lastHistoryEnty.name, // didn't change
    title: lastHistoryEnty.title, // didn't change
    content: secondLastHistoryEnty.content,
    utc_datetime: new Date().toISOString(),
    status: ArticleStatus.ACTIVE
  })
  await db.set(req.body.articleId, JSON.stringify(dbEntry));

  // generate event
  await generateEvent(EventType.ARTICLE_UPDATED, {
    articleId: req.body.articleId,
    author: NLPParams.username,
    name: lastHistoryEnty.name,
    title: lastHistoryEnty.title,
    content: secondLastHistoryEnty.content,
    status: ArticleStatus.ACTIVE
  });

  // return HTTP response
  res.status(204).end();
}));

app.get("/comments/:articleId", NLPRoute({}, async (req, res) => {
  console.log(`Get comments called with original url ${req.originalUrl}`);
  const articleId = req.originalUrl.substring(10);
  console.log(`Get comments called on ${articleId}`);
  const articleStr = await db.get(articleId);
  if (articleStr === null) {
    res.status(404).send("Article not found\n");
    return;
  }
  const dbEntry = JSON.parse(articleStr) as ArticlesDBEntry;
  res.status(200).send(dbEntry.comments);
}));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
