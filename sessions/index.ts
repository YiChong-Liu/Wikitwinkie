import { randomUUID } from "crypto";
import axios from "axios";
import type { AxiosResponse } from "axios";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import redis from "redis";
import { NLPRoute } from "./utils/utils.js";
import type { AccountManagementCheckPasswordResponse, EventType } from "./utils/interfaces.js";

// session expiry in milliseconds
const SESSION_EXPIRY_MS = 24 * 3600 * 1000

const EVENT_LISTENERS: EventType[] = [];

const PORT = 4001;
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const SERVER_FACING_PORT = 4101;
const serverFacingApp = express();
serverFacingApp.use(logger("dev"));
serverFacingApp.use(express.json());

const db = redis.createClient({
  socket: {
    host: "sessionsdb",
    port: 6379
  }
});

const validateSession = async (sessionId: string, username: string) => {
  const sessionStr = await db.get(sessionId);
  if (sessionStr === null) {
    // session does not exist
    return false;
  }

  const session = JSON.parse(sessionStr);

  // check if session is expired
  if (new Date() >= new Date(session.expiry)) {

    // delete the expired session from the database
    await db.del(sessionId);

    return false;
  }

  // return true only if username matches
  return session.username === username;
};

serverFacingApp.get("/registered_events", (req, res) => {
  res.status(200).send(EVENT_LISTENERS);
});

serverFacingApp.post("/validate", NLPRoute({
  bodySchema: {
    properties: {
      sessionId: { type: "string" },
      username: { type: "string" }
    }
  }
} as const, async (req, res) => {
  res.status(200).send({
    sessionValid: await validateSession(req.body.sessionId, req.body.username)
  });
}));

app.post("/login", NLPRoute({
  bodySchema: {
    properties: {
      username: { type: "string" },
      password: { type: "string" }
    }
  },
  // sessionCookieRequired: true
} as const, async (req, res) => {
  // todo: move this route in accountmanagement to a different port that is not publicly exposed
  const checkPassResponse: AxiosResponse<AccountManagementCheckPasswordResponse> = await axios.post(
    "http://accountmanagement:4102/checkpassword",
    {
      username: req.body.username,
      password: req.body.password
    }
  );
  if (checkPassResponse.data.success) {

    // delete old session if the user is already logged in
    if (req.cookies.sessionId !== undefined) {
      await db.del(req.cookies.sessionId);
    }

    // create a new session
    const sessionId = randomUUID();
    await db.set(sessionId, JSON.stringify({
      username: req.body.username,
      expiry: new Date(Date.now() + SESSION_EXPIRY_MS).toISOString()
    }));

    res.status(200).cookie("username", req.body.username)
                   .cookie("sessionId", sessionId)
                   .send({
      success: true,
      sessionId: sessionId
    });
  } else {
    res.status(200).send({
      success: false,
      error: "Invalid username/password"
    });
  }
}));

app.post("/logout", NLPRoute({}, async (req, res) => {
  if (req.cookies.sessionId === undefined) {
    res.status(200);
    if (req.cookies.username !== undefined) {
      res.clearCookie("username");
    }
    res.end();
  } else {
    // we want to delete the session without checking the username
    // even if the username is wrong, the session should be deleted
    //     if someone is trying to log it out
    await db.del(req.cookies.sessionId);
    res.status(200).clearCookie("sessionId");
    if (req.cookies.username !== undefined) {
      res.clearCookie("username");
    }
    res.end();
  }
}));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
serverFacingApp.listen(SERVER_FACING_PORT, () => {
  console.log(`Listening on port ${SERVER_FACING_PORT}`);
})
