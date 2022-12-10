export const Type = {
    COMMENT_CREATED : 'CommentCreated',
    COMMENT_GET: 'CommentGet'
}


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
