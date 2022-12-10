import redis from "redis";
import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
// import fs from 

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

app.post("/image/{name}", NLPRoute({
    bodySchema: {
        properties: {
            name: { type: "string" }
        }
    },
} as const, async (req, res) => {

    const img = await db.get(req.body.name);

    if(img !== null) {
        res.writeHead(200, {"Content-Type": "image/png"});
        var buff = new Buffer(img, 'binary');
        res.end(buff);
    }
    else {
        // return a placeholder image
        // res.writeHead(404, {"Content-Type": "image/png"});
        // var buff = new Buffer(img, 'binary');
        // res.end(buff);
    }
}))

