// TODO: Put this to Common utils.ts later
export const Type = {
    COMMENT_CREATED : 'CommentCreated',
    COMMENT_VOTED : 'CommentVoted'
}

export interface IEvent {
    type: string
    data: any
}