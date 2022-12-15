# Author
Keith Pham ([@minhnghia2208](https://github.com/minhnghia2208))

# Search Engine Service (SES)

## Service Description
SES fetchs Articles whose contents contain search keywords. 

SES uses Reverse Index method to achieve O(1) Response time

## Inter-service interactions:
SES listens to ARTICLE_CREATED event from Article Service. ARTICLE_CREATED event contains content of the created article.

SES indexes the content of the created article and save the indexes into Redis

## Endpoints:
- URL: /search?content={content}

    Method: GET

    Response: 

    200 OK {"articleId": string[]}

    404 NOT FOUND { message: e }

    Description: Search for articleId which contains keywords in {content} params
    
- URL: /search/indexing

    Method: POST

    Body: { articleId: string, title: string, content: string}

    Response: 

    200 OK { articleId: string, title: string, content: string}

    404 NOT FOUND { message: e }

    Description: Reverse Indexing content from article. Save in Redis using "word" as key

## Tutorial using Postman or other API Platform
- Step 1:
    POST: http://localhost:4405/search/indexing
    Body: 
    {
        "articleId": "1",
        "title": "Ipsum"
        "content": "John Doe"
    }
- Step 2:
    GET: http://localhost:4405/search/John

    Reponse: { "articleId": ["1"] }

    GET: http://localhost:4405/search/test

    Reponse: { "articleId": [] }