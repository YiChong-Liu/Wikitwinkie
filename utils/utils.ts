// import { fileURLToPath } from "url";
// import path from "path";
import type { Request, Response } from "express";
import Ajv from "ajv/dist/jtd.js";
import type { JTDSchemaType, JTDDataType } from "ajv/dist/jtd";
import type * as expressCore from "express-serve-static-core";

const ajv = new Ajv();

// export const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export const asyncRoute = (route: (req: Request, res: Response) => Promise<void>) =>
                          (req: Request, res: Response, next = console.error) =>
                          Promise.resolve(route(req, res)).catch(next);

export const asyncRouteWithBody = <T>(bodySchema: T, route: (req: Request<expressCore.ParamsDictionary, any,
                                                                          JTDDataType<T>>,
                                                             res: Response) => Promise<void>) => {
  const validateSchema = ajv.compile(bodySchema as JTDSchemaType<JTDDataType<T>>);
  return (request: Request, response: Response, next=console.error) => {
    if (validateSchema(request.body)) {
      Promise.resolve(route(request, response)).catch(next);
    } else {
      response.status(400);
      console.log(`Error in request body: ${validateSchema.errors}`)
      // response.send(`Error in body: ${error}\n`);
      // // send automatically ends the response
    }
  };
};

// const requireAttrs = term => (obj, attrs, response) => {
//   for (const attr of attrs) {
//     if (!obj.hasOwnProperty(attr)) {
//       response.status(400);
//       response.send(`Missing required ${term}: ${attr}`);
//       // send automatically ends the response
//       return false;
//     }
//   }
//   return true;
// };
// export const requireParams = requireAttrs("parameter");

// export const serve404 = response =>
//   response.status(404).sendFile(`${projectRoot}/client/404.html`, {
//     lastModified: false
//   }, err => {
//     if (err) {
//         response.status(500).end();
//     }
//   });
