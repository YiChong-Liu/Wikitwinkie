# Comment Vote Service

## System Design
Link: https://docs.google.com/document/d/16Upk8h3mSBbqCPcpqjEV3224Noz2sLAB0JTWROl__yU/edit

## Data Model:
- CommentVote: {"commentId": string, "articleId": string, "vote": number} 
- CommentVotes: CommentVote[]

## Data Structure in Redis:
- key<articleId: string>
- value<commentvotes: CommentVotes>

## File Structure:
- index.ts: contains comments service endpoints
- utils.ts: contains interfaces adn checktype
- db.ts: contains redis operations (e.g. CRUD)