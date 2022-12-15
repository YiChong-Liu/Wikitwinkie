# Sessions service

Author: Neil Gupta ([@nog642](https://github.com/nog642))

## Description

This is the sessions service. It keeps track of users' sessions (created when they log in and deleted when they log out).

## Endpoints

Client facing endpoints (port `4001`):

* `POST /login`
    * Used to log in (create a new session)
    * Request body: `{ username: string, password: string }`
    * Responses:
        * `200 OK` with `Set-Cookie` header and body `{ success: boolean, sessionId: string }`
        * `400 BAD REQUEST` with error message
* `POST /logout`
    * Used to log out (delete a session)
    * No request body
    * Responses:
        * `204 NO CONTENT` with `Set-Cookie` header
        * `400 BAD REQUEST` with error message

Server facing endpoints (port `4101`):

* `POST /validate`
    * Used by other services to validate a user session
    * Request body: `{ sessionId: string, username: string }`
    * Responses:
        * `200 OK` with body `{ sessionValid: boolean }`
        * `400 BAD REQUEST` with error message
* `GET /registered_events`
    * Used to tell the event bus which events to send
    * Responses:
        * `200 OK` with body `EventType[]`
* `POST /events`
    * Event listener endpoint
    * Request body: `<T extends EventType>{ type: T, data: EventBody<T> }`
    * Responses:
        * `204 NO CONTENT`

## Tutorial

This service is best run along with all the other services using `docker compose build` and then `docker compose up` at the root level of this repository.

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `sessions` directory, then run `npm start`. Note that the database needs to be running as well under the host name `sessionsdb`, or this will fail.

## Architecture

Most services access the `/validate` endpoint of this service directly, via the `NLPRoute` library function defined in the top-level `utils` directory (more details below). We used direct communication between the services here rather than an event, because when a user is performing an action that requires them to be logged in, we need to first validate their session, then respond to the request. If we used events to validate the session, the result of the session validation would come in in the `/events` endpoint, in a completely different call stack, and there is no remotely clean way that I could think of to have that then trigger a response to the original request. Using direct communication, the main request has to wait (as it should, since it cannot proceed without knowing if the session is valid) for `/validate` to respond directly.

`/validate` is one of the few exceptions we made to using the event bus to communicate between processes. Another exception is the `/checkpassword` endpoint of the account management endpoint, which is called exclusively from this service's `/login` endpoint. Again, it is a very similar situation to `/validate` where we need a synchronous response to know whether the password is valid or not before we can continue processing the login request.

This service generates no events and listens to no events.

Port `4101` is not exposed to the client, which is good for security because it limits attack surface.

### `NLPRoute` library function (exceeding expectation component)

`NLPRoute` (named after our team name, NLP) is a nice abstraction I wrote to simplify defining endpoints for express. It serves two primary functions:

First, it takes a body schema in [JSON Typedef](https://jsontypedef.com/docs/jtd-in-5-minutes/) format, and validates it using [Ajv](https://ajv.js.org/guide/typescript.html). Ajv also allows us to statically deduce the typescript type of `req.body` using the schema (using `as const` is important), which allows us to avoid defining the schema twice (once for typescript typing and once for runtime validation). This is what I spent my time on the most near the start of the project.

Second, it optionally (an enum flag passed into the config to define required/optional or not checked if it is omitted) reads the cookie header and validates the schema. That part directly relates to this service, since it calls the `/validate` endpoint.

`NLPRoute` takes in a config object, which includes both an optional body schema (no checking if it is omitted) and optional parameters about session checking. It also takes an async function. Another function of `NLPRoute` is that it makes epxress handle async function error handling correctly, which it does not by default. It returns a new non-async function, which gets passed into a regular route in a service. It also passes a third parameter to the async function passed in, which is `NLPParams`, which contains the username of the user if the session was validated (that is all it contains but it is an object so more things could be added easily).

`NLPRoute` is located in `utils/utils.js` in the repository root.
