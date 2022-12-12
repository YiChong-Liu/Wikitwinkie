import redis from "redis";
import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
// import fs from

import { EventType } from "./utils/interfaces.js";
import { NLPRoute } from "./utils/utils.js";

const app = express();
const PORT = 4003;
const EVENT_LISTENERS: EventType[] = [];

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db = redis.createClient({
    socket: {
        host: "image_managementdb",
        port: 6379
    }
})

app.get("/registered_events", (req, res) => {
    res.status(200).send(EVENT_LISTENERS);
});

app.post("/image/{name}", NLPRoute({
    bodySchema: {
        properties: {
            name: { type: "string" }
        }
    },
} as const, async (req, res) => {

    const img = await db.get(req.body.name);

    // if image exists in db, return 200 OK with image
    if (img) {
        res.status(200).send(img);
    } else {
        // if image does not exist, return 404 Not Found with the default.png image in the img folder
        res.status(404).sendFile("default.png", { root: "./img" });
    }
}))

await db.connect();
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

