## Article Vote Service

### Author

Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))

### Description

Each reader is able to click "upvote" and "downvote" after reading the article.

### Service Interaction

Use articleId from article service and generate / update votes.

### API Endpoints

- Get Article Vote
  - URL: /articles/:articleId/vote
  - Method: GET
  - Response: 
    - 201 OK {"articleId": string, "vote": integer}
    - 404 NOT FOUND Invalid article vote
- Init Article Vote
  - URL: /articles/:articleId/vote
  - Method: POST
  - Request Body: {"articleId": string, "vote": integer}
  - Response
    - 201 OK {"articleId": string, "vote": integer}
    - 404 NOT FOUND Invalid article vote
- Edit Article Vote
  - URL: /articles/:articleId/vote
  - Method: PUT
  - Request Body: {"articleId": string, "vote": integer}
  - Response
    - 201 OK {"articleId": string, "vote": integer}
    - 404 NOT FOUND Invalid article vote

### Tutorial

This service is best run along with all the other services using `docker compose build` and then `docker compose up` at the root level of this repository.

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `article_vote` directory, then run `npm start`. Note that the database needs to be running as well under the host name `article_votedb`, or this will fail.