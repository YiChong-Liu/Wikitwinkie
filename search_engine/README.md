# Author
Keith Pham ([@minhnghia2208](https://github.com/minhnghia2208))

# Search Engine Service (SES)

## Service Description
SES fetchs Articles whose contents contain search keywords

## Inter-service interactions:
SES listens to ARTICLE_CREATED event from Article Service. ARTICLE_CREATED event contains content of the created article.

SES indexes the content of the created article and save the indexes into Redis

## Endpoints:
URL: /search?content={content}

Method: GET

Response: 

200 OK{"articleId": string[]}

404 NOT FOUND Invalid search content 

Descript:


## File Structure:
- index.ts: contains comments service endpoints
- utils.ts: contains interfaces adn checktype
- db.ts: contains redis operations (e.g. CRUD)