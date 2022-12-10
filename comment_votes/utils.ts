export const Type = {
    COMMENT_CREATED : 'CommentCreated',
    COMMENT_VOTED : 'CommentVoted',
    COMMENT_VOTE_INIT: 'CommentVoteInited',
    COMMENT_VOTE_GET: 'CommentVoteGet',
}

export interface CommentVote {
    commentId: string,
    articleId: string,
    vote: number
}

export interface VoteKey {
    commentId: string,
    articleId: string
}

export interface IEvent {
    type: string
    data: any
}

export interface ErrorMessage {
    message: any
}

export function instaceOfErrorMessage(object: any): object is ErrorMessage {
    return 'message' in object;
}

export function instanceOfCommentVote(object: any): object is CommentVote {
    return 'commentId' && 'articleId' && 'vote' in object;
}

export function parsedKey(key: VoteKey): string {
    return key.articleId + "," + key.commentId;
}


