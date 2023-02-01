# Author
Keith Pham ([@minhnghia2208](https://github.com/minhnghia2208))

# Comment Vote Service

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