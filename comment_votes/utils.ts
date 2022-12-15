export interface CommentVote {
    commentId: string,
    articleId: string,
    vote: number
}

export interface VoteKey {
    commentId: string,
    articleId: string
}

export interface ErrorMessage {
    message: any
}

export function instaceOfErrorMessage(object: any): object is ErrorMessage {
    return 'message' in object;
}

export function instanceOfCommentVote(object: any): object is CommentVote {
    return 'vote' in object;
}

export function parsedKey(key: VoteKey): string {
    return key.articleId + "," + key.commentId;
}


