import { randomUUID } from "crypto";
import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import redis from "redis";
import type { AxiosResponse } from "axios";
import { NLPRoute } from "./utils/utils.js";
import type { AccountManagementCheckPasswordResponse } from "./utils/interfaces.js";

// session expiry in milliseconds
const SESSION_EXPIRY_MS = 24 * 3600 * 1000

// const ajv = new Ajv();

// interface Session {
//   sessionId: string,
//   username: string,
//   expiry: string
// }
// const validateSchemaSession = ajv.compile({
//   properties: {
//     sessionId: {type: "string"},
//     username: {type: "string"},
//     expiry: {type: "string"},
//   }
// } as JTDSchemaType<Session>)

// type MyData = JTDDataType<typeof schema>

const PORT = 4001;
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));

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

serverFacingApp.post("/validate", NLPRoute({
  bodySchema: {
    properties: {
      sessionId: { type: "string" },
      username: { type: "string" }
    }
  }
} as const, async (req, res) => {
  const sessionStr = await db.get(req.body.sessionId);
  if (sessionStr === null) {
    // session does not exist
    res.status(200).send({ sessionValid: false });
    return;
  }

  const session = JSON.parse(sessionStr);

  // check if session is expired
  if (new Date() >= new Date(session.expiry)) {

    // delete the expired session from the database
    await db.del(req.body.sessionId);

    res.status(200).send({ sessionValid: false });
    return;
  }

  // return true only if username matches
  res.status(200).send({
    sessionValid: session.username === req.body.username
  });
}));

app.post("/login", NLPRoute({
  bodySchema: {
    properties: {
      username: { type: "string" },
      password: { type: "string" }
    }
  },
  sessionCookieRequired: true
} as const, async (req, res) => {
  // todo: move this route in accountmanagement to a different port that is not publicly exposed
  const checkPassResponse: AxiosResponse<AccountManagementCheckPasswordResponse> = await axios.post(
    "http://accountmanagement:4002/checkpassword",
    {
      username: req.body.username,
      password: req.body.password
    }
  );
  if (checkPassResponse.data.success) {

    // create a new session
    const sessionId = randomUUID();
    await db.set(sessionId, JSON.stringify({
      username: req.body.username,
      expiry: new Date(Date.now() + SESSION_EXPIRY_MS).toISOString()
    }))

    res.status(200).send({
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

app.post("/logout", NLPRoute({
  sessionCookieRequired: true
}, async (req, res) => {
  // todo
  res.status(200).send("todo");
}));

await db.connect();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
serverFacingApp.listen(SERVER_FACING_PORT, () => {
  console.log(`Listening on port ${SERVER_FACING_PORT}`);
})
