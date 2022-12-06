import type { Request, Response } from "express";
import Ajv from "ajv/dist/jtd.js";
import type { JTDSchemaType, JTDDataType } from "ajv/dist/jtd";
import type { DefinedError } from "ajv";
import type * as expressCore from "express-serve-static-core";

const ajv = new Ajv();

export const NLPRoute = <T>(
  config: {
    sessionCookieRequired?: boolean,
    bodySchema?: T
  },
  routeHandler: (req: Request<expressCore.ParamsDictionary, any, JTDDataType<T>>,
                 res: Response) => Promise<void>
) => {
  const validateSchema = config.bodySchema === undefined ? null
                         : ajv.compile(config.bodySchema as JTDSchemaType<JTDDataType<T>>);
  return (request: Request, response: Response, next=console.error) => {
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
    if (config.sessionCookieRequired) {
      // TODO: handle session cookies
    }
    Promise.resolve(routeHandler(request, response)).catch(next);
  };
};

// export const serve404 = response =>
//   response.status(404).sendFile(`${projectRoot}/client/404.html`, {
//     lastModified: false
//   }, err => {
//     if (err) {
//         response.status(500).end();
//     }
//   });
