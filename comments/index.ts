import express from "express";
import logger from "morgan";
import { randomBytes } from "crypto";
import cors from "cors";

const app = express();
const PORT = 4002;

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req: express.Request, res: express.Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// app.post("/posts/:id/comments", async (req, res) => {
//   const id = randomBytes(4).toString("hex");
//   const { content } = req.body;
//   const comments = commentsByPostId[req.params.id] || [];
//   comments.push({ id, content });
//   commentsByPostId[req.params.id] = comments;

//   await axios.post("http://eventbus:4005/events", {
//     type: "CommentCreated",
//     data: {
//       id,
//       content,
//       postId: req.params.id,
//     },
//   });

//   res.status(201).send(comments);
// });

// app.post("/events", (req, res) => {
//   console.log(req.body.type);
//   res.send({});
// });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  