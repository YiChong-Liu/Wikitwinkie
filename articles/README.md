# Articles service

Author: Neil Gupta ([@nog642](https://github.com/nog642))

## Description

This is the articles service. It keeps track of the authoritative data for all the articles, including article ID, name, title, content, status (deleted vs active), edit history, and comments (only the list of comment IDs associated with each article).

An article "name" is a URL-friendly identifier which is used to get the article. It is derived from the title, which can be any string. Articles can be renamed, so their title and name will change. An article "ID" is a unique identifier that does not change when the article is renamed.

This service is not used to actually get the articles, that is done by the article serving service.

## Endpoints

* `POST /create`
    * Used to create an article
    * Login required (cookie)
    * Request body: `{ title: string, content: string }`
    * Responses:
        * `200 OK` with body `{ name: string }`
        * `400 BAD REQUEST` with error message
* `POST /edit`
    * Used to edit an article
    * Login required (cookie)
    * Request body: `{ articleId: string, title: string, content: string }`
    * Responses:
        * `200 OK` with body `{ name: string }`
        * `400 BAD REQUEST` with error message
        * `404 NOT FOUND` with error message
* `POST /delete`
    * Used to delete an article
    * Login required (cookie)
    * Request body: `{ articleId: string }`
    * Responses:
        * `204 NO CONTENT`
        * `400 BAD REQUEST` with error message
        * `404 NOT FOUND` with error message
* `POST /restore`
    * Used to restore a deleted article
    * Login required (cookie)
    * Request body: `{ articleId: string }`
    * Responses:
        * `204 NO CONTENT`
        * `400 BAD REQUEST` with error message
        * `404 NOT FOUND` with error message
* `GET /comments/{articleId}`
    * Used to get a list of comment IDs for an article
    * Responses:
        * `200 OK` with body `string[]`
        * `404 NOT FOUND` with error message
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

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `articles` directory, then run `npm start`. Note that the database needs to be running as well under the host name `articlesdb`, or this will fail.

## Architecture

[how the service interacts with other services]
