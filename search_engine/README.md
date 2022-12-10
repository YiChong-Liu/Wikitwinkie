# Search Engine Service

## System Design
Link: https://docs.google.com/document/d/16Upk8h3mSBbqCPcpqjEV3224Noz2sLAB0JTWROl__yU/edit

## Data Model:
- Article: { "articleId": string } 
- Articles: Article[]

## Data Structure in Redis:


## File Structure:
- index.ts: contains comments service endpoints
- utils.ts: contains interfaces adn checktype
- db.ts: contains redis operations (e.g. CRUD)