# Article serving service

Author: Neil Gupta ([@nog642](https://github.com/nog642))

## Description

This is the article serving service. It is used to get the most updated version of an article, and could contain some server-side rendering. That was the original intention, but it has not been implemented. There is still reason for this service to be separate though - see the Architecture section below. In brief, the articles are fetched by name, so that the URL roughly matches the article title, and the name can change when an article is renamed. The articles service only maintains a database indexed by article ID, which is constant and does not change. A separate index (maintained by this service) is needed to get articles by name. This database is kept up to date by listening to events.

## Endpoints

* `get /{name}`
    * Used to get an article for rendering
    * Request body: `{ title: string, content: string }`
    * Responses:
        * `200 OK` with body `{ articleId: string, title: string, content: string, status: string }`
        * `404 NOT FOUND`
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

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `articleserving` directory, then run `npm start`. Note that the database needs to be running as well under the host name `articleservingdb`, or this will fail.

## Architecture

This service listens to the `ArticleCreated` and `ArticleUpdated` events to keep track of articles. It contains essentially two databases (using namespaced Redis keys), one mapping article names to data, and one mapping article IDs to article names. Remember (you should read the articles service README.md before this for context) that the title is the 'display name' and the name is what actually used to get the article (in the `GET /{name}` endpoint). The article name can change when the article is renamed, but the article ID stays the same. When articles are deleted, their status is marked as deleted, but the article ID persists. The article ID to article name mapping is needed to update the data given an `ArticleUpdated` event, where the aricle ID is the only thing guaranteed to be the same as before.

This service does not generate any events. It is just called by the client to get article data by name. The articles service does not maintain an index of articles by name, only by article ID. This service maintains the index by name as well.
