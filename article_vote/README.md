## Article Vote Service

### Author

Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))

### Description

Each reader is able to click "upvote" and "downvote" after reading the article.

### Service Interaction



### API Endpoints

- Vote on article
  - URL: /articleVote
  - Method: PUT
  - Request Body: {"articleId": string, "upvote": integer, "downvote": integer}
  - Response: 
    - 200 OK {"articleId": string, "upvote": integer, "downvote": integer}
    - 404 NOT FOUND Invalid article

### Tutorial