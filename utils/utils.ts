import type { Request, Response } from "express";
import Ajv from "ajv/dist/jtd.js";
import type { JTDSchemaType, JTDDataType } from "ajv/dist/jtd";
import type * as expressCore from "express-serve-static-core";

const ajv = new Ajv();

export const NLPRoute = <T>(
  config: {
    sessionCookieRequired?: boolean,
    bodyScehma?: T
  },
  routeHandler: (req: Request<expressCore.ParamsDictionary, any, JTDDataType<T>>,
                 res: Response) => Promise<void>
) => {
  const validateSchema = config.bodyScehma === undefined ? null
                         : ajv.compile(config.bodyScehma as JTDSchemaType<JTDDataType<T>>);
  return (request: Request, response: Response, next=console.error) => {
    if (validateSchema !== null) {
      if (!validateSchema(request.body)) {
        response.status(400);
        console.log(`Error in request body: ${validateSchema.errors}`)
        // response.send(`Error in body: ${error}\n`);
        // // send automatically ends the response
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
