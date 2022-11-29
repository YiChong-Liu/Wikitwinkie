// import { fileURLToPath } from "url";
// import path from "path";
import type { Request, Response } from "express";

// export const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export const asyncRoute = (route: (req: Request, res: Response) => Promise<void>) =>
                          (req: Request, res: Response, next = console.error) =>
                          Promise.resolve(route(req, res)).catch(next);

// const JSON_TYPEOF_VALUES = new Set(["object", "boolean", "number", "string"]);

// const schemaCheck = (obj, schema) => {
//   for (const attr in schema) {
//     if (!obj.hasOwnProperty(attr)) {
//       return [false, `Missing required key: ${attr}`];
//     }
//     if ((typeof obj[attr]) != schema[attr]) {
//       return [false, `key "${attr}" must be ${schema[attr]} not ${typeof obj[attr]}`];
//     }
//   }
//   return [true, ""];
// }

// const validateJSONSchema = schema => {
//   for (const attr in schema) {
//     const attrType = schema[attr];
//     if ((typeof attrType) != "string") {
//       throw "schema values must be strings (return value of typeof)";
//     }
//     if (!JSON_TYPEOF_VALUES.has(attrType)) {
//       throw `Invalid JSON type in schema: ${attrType}`;
//     }
//   }
//   return schema;
// }

// export const asyncRouteWithBody = (bodySchema, route) => {
//   validateJSONSchema(bodySchema);
//   return (request, response, next=console.error) => {
//     const [valid, error] = schemaCheck(request.body, bodySchema);
//     if (valid) {
//       Promise.resolve(route(request, response)).catch(next);
//     } else {
//       response.status(400);
//       response.send(`Error in body: ${error}\n`);
//       // send automatically ends the response
//     }
//   };
// };

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
