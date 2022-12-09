import redis from "redis"
import express from "express";
import logger from "morgan";
import cors from "cors";
import { NLPRoute } from "./utils/utils.js";


const app = express();
const PORT = 4004;

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db = redis.createClient({
    socket: {
        host: "articlevotedb",
        port: 6379
    }
})

app.put("/articleVote", NLPRoute({
    bodySchema: {
        properties: {
            articleId: { type: "string" },
            vote: { type: "integer" }
        }
    },
} as const, async (req, res) => {

}))