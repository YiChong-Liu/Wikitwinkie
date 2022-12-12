import express from "express";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { EventType } from "./utils/interfaces.js";
import { NLPRoute } from "./utils/utils.js";
// import { generateEvent, NLPRoute } from "./utils/utils.js";

const PORT = 4006;
const EVENT_LISTENERS: EventType[] = [
  EventType.ArticleCreated
];

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

app.post("/events", NLPRoute({}, async (req, res) => {
  ;
}));

// app.post("/create", NLPRoute({
//   bodySchema: {
//     properties: {
//       title: { type: "string" },
//       content: { type: "string" }
//     }
//   },
//   sessionCookie: "required"
// } as const, async (req, res, NLPParams) => {
//   const articleId = getArticleId(req.body.title);
//   console.log(`Create article called with title ${req.body.title} and content ${req.body.content}`);
//   // TODO: validate content
//   await db.set(articleId, JSON.stringify({
//     history: [{
//       author: NLPParams.username, // TODO
//       name: articleId, // TODO: change this to allow changing name
//       title: req.body.title,
//       content: req.body.content,
//       utc_datetime: new Date().toISOString(),
//       status: ArticleStatus.ACTIVE
//     }],
//     comments: []
//   }));
//   generateEvent(EventType.ArticleCreated, {
//     articleId: articleId,
//     author: NLPParams.username,
//     name: articleId, // TODO: change this to allow changing name
//     title: req.body.title,
//     content: req.body.content
//   });
//   res.status(200).send({
//     articleId: articleId
//   });
// }));

// app.post("/edit", NLPRoute({
//   bodySchema: {
//     properties: {
//       articleId: { type: "string" },
//       title: { type: "string" },
//       content: { type: "string" }
//     }
//   },
//   sessionCookie: "required"
// } as const, async (req, res) => {
//   // TODO
//   res.status(200).end();
// }));

// app.post("/delete", NLPRoute({
//   bodySchema: {
//     properties: {
//       articleId: { type: "string" },
//       title: { type: "string" },
//       content: { type: "string" }
//     }
//   },
//   sessionCookie: "required"
// } as const, async (req, res) => {
//   // TODO
//   res.status(200).end();
// }));

// app.post("/restore", NLPRoute({
//   bodySchema: {
//     properties: {
//       articleId: { type: "string" },
//       title: { type: "string" },
//       content: { type: "string" }
//     }
//   },
//   sessionCookie: "required"
// } as const, async (req, res) => {
//   // TODO
//   res.status(200).end();
// }));

// app.get("/:name/comments", NLPRoute({}, async (req, res) => {
//   console.log(req.params.name);
//   // TODO
//   res.status(200).end();
// }));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
