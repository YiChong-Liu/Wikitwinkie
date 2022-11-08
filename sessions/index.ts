import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import redis from "redis";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"

const PORT = 4001;

const app = express();
const ajv = new Ajv()

interface Session {
  sessionId: string,
  username: string,
  expiry: string
}
const validateSchemaSession = ajv.compile({
  properties: {
    sessionId: {type: "string"},
    username: {type: "string"},
    expiry: {type: "string"},
  }
} as JTDSchemaType<Session>)

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db = redis.createClient({
  socket: {
    host: "sessionsdb",
    port: 6379
  }
});

app.get("/login", async (req, res) => {
  // todo: move this route in accountmanagement to a different port that is not publicly exposed
  await axios.post("http://accountmanagement:4001/checkpassword", );
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

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
