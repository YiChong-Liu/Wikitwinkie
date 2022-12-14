import Ajv from "ajv/dist/jtd.js";
import type { JTDSchemaType, JTDDataType } from "ajv/dist/jtd";
import type { DefinedError } from "ajv";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type cookieParser from "cookie-parser";  // require this to be installed
import type { Express, Request, Response } from "express";
import type * as expressCore from "express-serve-static-core";
import { EventBody, EventType } from "./interfaces.js"
import type { SessionsValidateSessionResponse } from "./interfaces.js"

const ajv = new Ajv();

const cookieSchema = {
  properties: {
    username: { type: "string" },
    sessionId: { type: "string" }
  }
} as const;
const validateSessionCookieSchema = ajv.compile(cookieSchema as JTDSchemaType<JTDDataType<typeof cookieSchema>>);

type NLPParams<sessionCookie extends ("required" | "optional")> = {
  username: sessionCookie extends "required" ? string : string | null
};

export const NLPRoute = <T, sessionCookie extends ("required" | "optional")>(
  config: {
    sessionCookie?: sessionCookie,
    bodySchema?: T
    sessionFailStatus?: number
  },
  routeHandler: (req: Request<expressCore.ParamsDictionary, any, JTDDataType<T>>,
                 res: Response,
                 NLPParams: NLPParams<sessionCookie>) => Promise<void>
) => {
  const sessionFailStatus = config.sessionFailStatus === undefined ? 400 : config.sessionFailStatus;
  const validateSchema = config.bodySchema === undefined ? null
                         : ajv.compile(config.bodySchema as JTDSchemaType<JTDDataType<T>>);
  const asyncHandler = async (request: Request, response: Response, next=console.error) => {
    let username: string | null = null;

    // validate session cookies
    if (config.sessionCookie) {
      if (request.cookies === undefined) {
        console.error("ERROR: You need to use the cookieParser middleware for express to validate session cookies");
        response.status(500).send("Misconfigured service\n");
        return;
      }
      let sessionValid;
      let sessionCookieError;
      if (validateSessionCookieSchema(request.cookies)) {
        const validateResponse: AxiosResponse<SessionsValidateSessionResponse> = await axios.post(
          "http://sessions:4101/validate",
          {
            username: request.cookies.username,
            sessionId: request.cookies.sessionId
          }
        );
        if (validateResponse.data.sessionValid) {
          sessionValid = true;
        } else {
          sessionValid = false;
          sessionCookieError = "Invalid session";
          response.status(sessionFailStatus).clearCookie("username").clearCookie("sessionId");
        }
      } else {
        sessionValid = false;
        sessionCookieError = (validateSessionCookieSchema.errors as DefinedError[])[0].message as string;
        response.status(sessionFailStatus);
      }
      if (sessionValid) {
        username = request.cookies.username;
      } else {
        response.send(`Error in session cookie: ${sessionCookieError}\n`);
        return;
      }
    }

    // validate body
    if (validateSchema !== null) {
      if (!request.is("application/json")) {
        response.status(400).send("Content-Type must be application/json\n");
        return;
      }
      if (!validateSchema(request.body)) {
        response.status(400).send(`Error in body: ${(validateSchema.errors as DefinedError[])[0].message}\n`);
        return;
      }
    }

    await routeHandler(request, response, {
      username: username
    } as NLPParams<sessionCookie>);
  };
  return (request: Request, response: Response, next=console.error) =>
             Promise.resolve(asyncHandler(request, response)).catch(next);
};

export const generateEvent = async <T extends EventType>(eventType: T, data: EventBody<T>) => {
  await axios.post("http://eventbus:2000/events", {
    type: eventType,
    data: data
  });
};

export const listenToEvents = (app: Express, handlers: {[key in EventType]?: (data: EventBody<key>) => any}) => {
  const registeredEvents = Object.keys(handlers) as EventType[];
  app.get("/registered_events", (req, res) => {
    res.status(200).send(registeredEvents);
  });
  app.post("/events", NLPRoute({
    bodySchema: {
      properties: {
        type: { enum: Object.values(EventType) },
        data: {} // any data
      }
    }
  } as const, async (req, res) => {
    const handler = handlers[req.body.type];
    if (handler !== undefined) {
      await handler(req.body.data);
    }
    res.status(204).end();
  }));
};
