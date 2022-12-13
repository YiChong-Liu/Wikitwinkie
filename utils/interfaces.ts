// eventbus
export enum EventType {
  ARTICLE_CREATED = "ArticleCreated",
  COMMENT_CREATED = "CommentCreated",
  COMMENT_GET = "CommentGet",
  COMMENT_EDITED = "CommentEdited",
  COMMENT_DELETED = "CommentDeleted",
  COMMENT_VOTED = "CommentVoted",
  COMMENT_VOTE_INIT = "CommentVoteInited",
  COMMENT_VOTE_GET = "CommentVoteGet",
  COMMENT_VOTE_CHANGED = "CommentVoteChanged",
}
export interface IEvent {
  type: EventType,
  data: any
}

// event bodies
export interface ArticleCreatedEventData {
    articleId: string,
    author: string,
    name: string,
    title: string,
    content: string
}

// sessions
export interface SessionsLoginResponseSuccessful {
  success: true,
  sessionId: string,
}
export interface SessionsLoginResponseFailed {
  success: false,
  error: string,
}
export type SessionsLoginResponse = SessionsLoginResponseSuccessful | SessionsLoginResponseFailed;
export interface SessionsValidateSessionResponse {
  sessionValid: boolean;
}

// accountmanagement
export interface AccountManagementCheckPasswordResponse {
  success: boolean;
}
export interface AccountManagementCreateUserResponseSuccessful {
  success: true,
  username: string,
  sessionId: string
}
export interface AccountManagementCreateUserResponseFailed {
  success: false,
  error: string
}
export type AccountManagementCreateUserResponse = AccountManagementCreateUserResponseSuccessful
                                                  | AccountManagementCreateUserResponseFailed;

// articles
export enum ArticleStatus {
  ACTIVE = "active",
  DELETED = "deleted"
}
export interface ArticleCreateResponse {
  articleId: string
}

// article serving
export interface ArticleServingResponse {
  title: string,
  content: string,
  status: string
}

export interface ArticleSearchEngineResponse extends ArticleCreateResponse, ArticleServingResponse {}

// comment
export interface CommentKey {
  commentId: string,
  articleId: string
}
export interface Comment extends CommentKey {
  username: string,
  content: string,
}