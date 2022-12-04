import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import redis from "redis";
// import Ajv from "ajv/dist/jtd.js";
// import type { JTDSchemaType, JTDDataType }  from "ajv/dist/jtd";
import { asyncRoute, asyncRouteWithBody } from "./utils/utils.js";

const PORT = 4001;

const app = express();

// const ajv = new Ajv();

// interface Session {
//   sessionId: string,
//   username: string,
//   expiry: string
// }
// const validateSchemaSession = ajv.compile({
//   properties: {
//     sessionId: {type: "string"},
//     username: {type: "string"},
//     expiry: {type: "string"},
//   }
// } as JTDSchemaType<Session>)

// type MyData = JTDDataType<typeof schema>

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db = redis.createClient({
  socket: {
    host: "sessionsdb",
    port: 6379
  }
});

app.post("/login", asyncRouteWithBody({
  properties: {
    username: {type: "string"},
    password: {type: "string"}
  }
} as const, async (req, res) => {
  // todo: move this route in accountmanagement to a different port that is not publicly exposed
  await axios.post("http://accountmanagement:4001/checkpassword", );
  res.status(200).send("todo").end();
}));

app.post("/validate", asyncRouteWithBody({
  properties: {
    sessionId: {type: "string"},
    username: {type: "string"}
  }
} as const, async (req, res) => {
  // todo
  res.status(200).send("todo").end();
}));

app.post("/logout", asyncRoute(async (req, res) => {
  // todo
  res.status(200).send("todo").end();
}));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
