https://docs.google.com/document/d/16Upk8h3mSBbqCPcpqjEV3224Noz2sLAB0JTWROl__yU/edit
# Comment Service
## Data Model:
- Comment: {"commentId": string, "articleId": string, "username": string, "content": string} 
- Comments: Comment[]

## Data Structure in Redis:
- key<postId: string>
- value<comments: Comments>

## File Structure:
- index.ts: contains comments service endpoints
- utils.ts: contains interfaces adn checktype
- db.ts: contains redis operations (e.g. CRUD)