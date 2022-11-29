export const Type = {
    POST_CREATED : 'PostCreated',
    COMMENT_CREATED : 'CommentCreated',
    COMMENT_MODERATED : 'CommentModerated',
    COMMENT_VOTED : 'CommentVoted'
}

export interface Comment {
    commentId: string,
    articleId: string,
    username: string,
    content: string,
}

export function createComment(comment: Comment) {
    return;
}

export function editComment(comment: Comment) {
    return;
}

export function  deleteComment(comment: Comment) {
    return;
}