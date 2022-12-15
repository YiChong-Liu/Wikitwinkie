import redis from "redis";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import {promises as fs} from "fs";

import { EventType } from "./utils/interfaces.js";
import { NLPRoute } from "./utils/utils.js";
import bodyParser from "body-parser";

const app = express();
const PORT = 4003;
const EVENT_LISTENERS: EventType[] = [];

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

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
    sessionCookie: "required",
    sessionFailStatus: 403
} as const, async (req, res) => {

    // completed in NLPRoute: return 403 forbidden if not logged in
   // console.log(JSON.stringify(req.body));
    const img = await db.exists(req.body.imageName);

    // if image does not exist in db, return 200 OK and store image in the redis
    if (!img) {
        await db.set(req.body.imageName, img);
        res.status(200).send("Image uploaded");
    } else {
        // if image exists in db, return 400 bad request
        res.status(400).send("Image already exists");
    }
}))

// get the image
app.get("/image/:name", NLPRoute({} as const, async (req, res) => {
    console.log(`Got GET request for image name: ${req.params.name}`);
    const img = await db.get(req.params.name);
    console.log(`Got image ${req.params.name} from database: ${img}`);

    // if image exists in db, return 200 OK with the image
    if (img) {
        
        res.status(200).send(req.params.image);
    } else {
        const data = await fs.readFile("./img/default.png", "binary");  
        res.writeHead(404, { "Content-Type": "image/png" });     
        // if image does not exist in db, return 404 not found with the default.png
        res.end(data);
    }
}))

// delete the image
app.delete("/image/:name", NLPRoute({} as const, async (req, res) => {
    const img = await db.exists(req.params.imageName);
    // if image exists in db, return 204 no content and delete the image
    if (img) {
        await db.del(req.params.imageName);
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

