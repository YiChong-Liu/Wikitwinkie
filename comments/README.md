# Author
Keith Pham ([@minhnghia2208](https://github.com/minhnghia2208))

# Comment Service (CS)

## Service Description
CS provides Comment API for Article Service 

## Inter-service interactions:
CS emmits COMMENT_CREATED event to CommentVote Service

## Endpoints:
- URL: /articles/:articleId/comments

    Method: GET

    Response: 

    200 OK {commentId: string, articleId: string, username: string, content: string}[] 

    404 NOT FOUND { message: e }

    Description: Get Article's Comments by articleId 
    
- URL: /articles/:articleId/comments

    Method: POST

    Body: { content: string, username: string}

    Response: 

    200 OK { commentId: string, content: string, articleId: string, username: string }

    404 NOT FOUND { message: e }

    Description: Create Comment

- URL: /articles/:articleId/comments/:commentId

    Method: PUT

    Body: { content: string, username: string}

    Response: 

    200 OK { commentId: string, content: string, articleId: string, username: string }

    404 NOT FOUND { message: e }

    Description: Edit Comment

- URL: /articles/:articleId/comments/:commentId

    Method: GET

    Response: 

    200 OK { commentId: string, articleId: string }

    404 NOT FOUND { message: e }

    Description: Delete Comment

## Tutorial
- User should be able to run endpoints after building Docker Image
- The following is the example endpoint calls to test Service using Postman or other API Platform
- Step 1:

    POST: http://localhost:4401/articles/123/comments

    Body: 
    {
        "username": "abc",
        "content": "content"
    }
- Step 2:

    GET: http://localhost:4401/articles/123/comments/${commentId from above}

    GET: http://localhost:4405/search/test

    Reponse: { "articleId": [] }