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
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const db = redis.createClient({
    socket: {
        host: "image_managementdb",
        port: 6379
    }
})

app.get("/registered_events", (req, res) => {
    res.status(200).send(EVENT_LISTENERS);
});

// upload the image
app.post("/image/:name", NLPRoute({
    bodySchema: {
        properties: {
            image: { type: "string" },
            imageName: { type: "string" },
            imageDescription: { type: "string" }
        }
    },
    sessionCookie: "required"
} as const, async (req, res) => {

    // completed in NLPRoute: return 403 forbidden if not logged in

    const img = await db.get(req.body.imageName);

    // if image exists in db, return 200 OK and store image in the redis
    if (img) {
        await db.set(req.body.imageName, req.body.image);
        res.status(200).send("Image updated");
    } else {       
    }
}))

// get the image
app.get("/image/:name", NLPRoute({
    bodySchema: {
        properties: {
            image: { type: "string" },
            imageName: { type: "string" },
            imageDescription: { type: "string" }
        }
    },
} as const, async (req, res) => {
    const img = await db.get(req.body.imageName);

    // if image exists in db, return 200 OK with the image
    if (img) {
        res.status(200).send(img);
    } else {
        // if image does not exist in db, return 404 not found with the default.png
        res.status(404).send("default.png");
    }
}))

// delete the image
app.delete("/image/:name", NLPRoute({
    bodySchema: {
        properties: {
            image: { type: "string" },
            imageName: { type: "string" },
            imageDescription: { type: "string" }
        }   
    },
} as const, async (req, res) => {
    const img = await db.exists(req.body.imageName);

    // if image exists in db, return 204 no content and delete the image
    if (img) {
        await db.del(req.body.imageName);
        res.status(204).end();
    } else {
        // if image does not exist in db, return 404 not found
        res.status(404).send("Image does not exist");
    }
}))


await db.connect();
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

