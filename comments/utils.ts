import express from 'express';

// export const Type = {
//     POST_CREATED : 'PostCreated',
//     COMMENT_CREATED : 'CommentCreated',
//     COMMENT_MODERATED : 'CommentModerated',
//     COMMENT_VOTED : 'CommentVoted'
// }

export interface Comment {
    commentId: string,
    articleId: string,
    username: string,
    content: string,
}

export interface ErrorMessage {
    message: any
}

export function instaceOfErrorMessage(object: any): object is ErrorMessage {
    return 'message' in object;
}

export function instanceOfComment(object: any): object is Comment {
    return 'commentId' in object;
}

export function instanceOfComments(object: any): object is Comment[] {
    let isComments: boolean = true;
    if (Array.isArray(object)) {
        object.forEach(function (x: any) {
            isComments = isComments && instanceOfComment(x);
        });
    }
    else {
        return false;
    }
    
    return isComments;
}

export interface CommentReq <ReqBody = Comment> extends express.Request {}

