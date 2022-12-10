export const Type = {
    COMMENT_CREATED : 'CommentCreated',
    COMMENT_GET: 'CommentGet',
    COMMENT_EDITED: 'CommentEdited',
    COMMENT_DELETED: 'CommentDeleted'
}

export interface CommentKey {
    commentId: string,
    articleId: string
}
export interface Comment extends CommentKey {
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
