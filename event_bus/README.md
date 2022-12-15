# Articles service

### Authors

- Neil Gupta ([@nog642](https://github.com/nog642))
- Keith Pham ([@minhnghia2208](https://github.com/minhnghia2208))
- Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))

## Description

This is the event bus service. It gets sent events from services, and forwards them on to other services that are listening for those events. There is dynamic registration of which events which service is listening to upon server startup.

## Endpoints

* `POST /events`
    * Used to generate/submit an event
    * Request body: `<T extends EventType>{ type: T, data: EventBody<T> }`
    * Responses:
        * `204 NO CONTENT`
        * `400 BAD REQUEST` with error message

## Tutorial

This service is best run along with all the other services using `docker compose build` and then `docker compose up` at the root level of this repository.

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `event_bus` directory, then run `npm start`. Note that the other services need to be running as well under their assigned host names in the docker compose, or this will fail.

## Architecture

On startup, this service queries each other back-end service at their `GET /registered_events` endpoints (retrying until success). They respond with a JSON list of strings corresponding to the enum `EventType`, and the event bus stores (in a global variable, not in a database as this service doesn't need a database) the mapping of event type to services. The services to query are stored at the top in a configuration variable.

Upon recieving an event, this service `POST`s the event to all the services that are registered as listening to that event, on their `/events` endpoint. It does this asynchronously (as in, calling an `async` function without `await`ing it) in order to respond to the service generating the event as quickly as possible.

### `listenToEvents` library function (exceeding expectation component)

We have a `listenToEvents` library function in `utils/utils.js` that makes setting up event listeners in services extremely convenient. This function takes in the express `app`, and an object mapping event types (a typescript `enum`)  to async function handlers/listeners. The listeners are called when their respective event type is recieved. See `articles/index.ts` for example usage.

The function sets up the `GET /registered_events` and `POST /events` routes automatically given the object containing the event listeners. It automatically sets up the service usign `GET /registered_events` to recieve all event types contained in the keys of the object, and thn adds a `POST /events` handler that parses the event type and passes the body along to the correct listener function.

But the most interesting part of this function is the typing. In `utils/interfaces.js`, we define types for the event bodies of several event types (with a default of `any` for the rest). Using some fancy typing, the event handler/listener functions, which take in a `data` argument containing the body of the event, automatically have the correct typing information for `data`, without having to hard-code each case. The event bodies are declared in one place.

There is also a less fancy `generateEvent` function wrapping the axios call to the `/events` endpoint of this service, which is also very usfeul.
