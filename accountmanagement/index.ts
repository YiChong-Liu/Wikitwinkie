import redis from "redis"
import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import { NLPRoute } from "./utils/utils";

const app = express();
const PORT = 4002;

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db = redis.createClient({
    socket: {
        host: "accountmanagementdb",
        port: 6379
    }
})

app.post("/users", NLPRoute ({
    
}));
