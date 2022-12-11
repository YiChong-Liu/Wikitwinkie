import Ajv from "ajv/dist/jtd.js";
import type { JTDSchemaType, JTDDataType } from "ajv/dist/jtd";
import type { DefinedError } from "ajv";
import axios from "axios";
import type { AxiosResponse } from "axios";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import type * as expressCore from "express-serve-static-core";
import type { SessionsValidateSessionResponse } from "./interfaces.js"

const ajv = new Ajv();

const cookieSchema = {
  properties: {
    username: { type: "string" },
    sessionId: { type: "string" }
  }
} as const;
const validateSessionCookieSchema = ajv.compile(cookieSchema as JTDSchemaType<JTDDataType<typeof cookieSchema>>);

type NLPParams = {
  username: string | null
};

export const NLPRoute = <T>(
  config: {
    sessionCookie?: "required" | "optional",
    bodySchema?: T
  },
  routeHandler: (req: Request<expressCore.ParamsDictionary, any, JTDDataType<T>>,
                 res: Response,
                 NLPParams?: NLPParams) => Promise<void>
) => {
  const validateSchema = config.bodySchema === undefined ? null
                         : ajv.compile(config.bodySchema as JTDSchemaType<JTDDataType<T>>);
  const asyncHandler = async (request: Request, response: Response, next=console.error) => {
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
    const NLPParams: NLPParams = {
      username: null
    };
    if (config.sessionCookie) {
      // TODO: handle session cookies
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
        }
      } else {
        sessionValid = false;
        sessionCookieError = (validateSessionCookieSchema.errors as DefinedError[])[0].message as string;
      }
      if (sessionValid) {
        NLPParams.username = request.cookies.username;
      } else {
        response.status(400).send(`Error in session cookie: ${sessionCookieError}\n`);
        return;
      }
    }
    await routeHandler(request, response, NLPParams);
  };
  return (request: Request, response: Response, next=console.error) =>
             Promise.resolve(asyncHandler(request, response)).catch(next);
};

// export const serve404 = response =>
//   response.status(404).sendFile(`${projectRoot}/client/404.html`, {
//     lastModified: false
//   }, err => {
//     if (err) {
//         response.status(500).end();
//     }
//   });
