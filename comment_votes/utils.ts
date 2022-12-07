// export const Type = {
//     POST_CREATED : 'PostCreated',
//     COMMENT_CREATED : 'CommentCreated',
//     COMMENT_MODERATED : 'CommentModerated',
//     COMMENT_VOTED : 'CommentVoted'
// }

export interface CommentVote {
    commentId: string,
    articleId: string,
    vote: number
}

export interface ErrorMessage {
    message: any
}

export function instaceOfErrorMessage(object: any): object is ErrorMessage {
    return 'message' in object;
}

export function instanceOfCommentVote(object: any): object is CommentVote {
    return 'commentId' in object;
}

export function instanceOfCommentVotes(object: any): object is CommentVote[] {
    let isCommentVote: boolean = true;
    if (Array.isArray(object)) {
        object.forEach(function (x: any) {
            isCommentVote = isCommentVote && instanceOfCommentVote(x);
        });
    }
    else {
        return false;
    }
    
    return isCommentVote;
}
