import express from "express";
import logger from "morgan";
// import cors from "cors";
// import axios from "axios";

const PORT = 4001;

const app = express();

app.use(logger("dev"));
app.use(express.json());
// app.use(cors());

// const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).send("yes").end();
});

// app.post("/posts", async (req, res) => {
//   const id = randomBytes(4).toString("hex");
//   const { title } = req.body;

//   posts[id] = {
//     id,
//     title,
//   };

//   await axios.post("http://eventbus:4005/events", {
//     type: "PostCreated",
//     data: {
//       id,
//       title,
//     },
//   });

//   res.status(201).send(posts[id]);
// });

// app.post("/events", (req, res) => {
//   console.log(req.body.type);
//   res.send({});
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
