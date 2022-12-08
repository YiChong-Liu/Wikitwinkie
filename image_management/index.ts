import redis from "redis";
import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";

import { NLPRoute } from "./utils/utils.js";

const app = express();
const port = 4003;

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db = redis.createClient({
    socket: {
        host: "imagemanagementdb",
        port: 6379
    }
})


