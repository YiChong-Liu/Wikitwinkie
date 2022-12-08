import redis from "redis"
import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import bcrypt from "bcrypt"
import { NLPRoute } from "./utils/utils";
import { addAbortSignal } from "stream";

const app = express();
const PORT = 4002;

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const saltRounds = 10;

const db = redis.createClient({
    socket: {
        host: "accountmanagementdb",
        port: 6379
    }
})

app.post("/createUser", NLPRoute({
    bodySchema: {
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        }
    },
    sessionCookieRequired: false
} as const, async(req, res) => {
    
    // Check if the username is duplicate 
    const userName = await db.get(req.body.username);
    // username does not exist
    if(userName === null) {

        await db.set(req.body.username, await bcrypt.hash(req.body.password, saltRounds));
        res.status(200).send({
            "success": true, 
            "username": req.body.username, 
            "sessionId": await axios.post(`http://${window.location.hostname}:4001/login`)
        })
    }
    else {
        res.status(200).send({
            "success" : false,
            "error": "Username is already taken"
        })
    }
}))

app.post('/editUser', NLPRoute({
    bodySchema: {
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        }
    },
} as const, async(req, res) => {
    // Check if the username exists
    const userName = await db.get(req.body.username);
    if(userName === null) {
        res.status(404).end();
    }

    // Change the password

    res.status(204).end();
}))

app.post('/checkpassword',NLPRoute({
    bodySchema: {
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        }
    },
} as const, async (req, res) => {
    
    const value = await db.get(req.body.username);
    if(value === null) {
        res.status(200).send({
            success: false
        })
    }
    else if(await bcrypt.compare(req.body.password, value)) {
        res.status(200).send({
            success: true
        })
    }

    res.status(200).send({
        success: false
    })
}))


/*app.post('/delete?user={username}', NLPRoute({
    bodySchema: {
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        }
    }, 
} as const, async (req, res) => {
    // check if username exists
    const value = await db.get(req.body.username);

}))*/