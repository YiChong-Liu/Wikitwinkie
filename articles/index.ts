import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { NLPRoute } from "./utils/utils.js";

const PORT = 4005;
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

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
