// eventbus
export enum EventType {
  ARTICLE_CREATED = "ArticleCreated",
  ARTICLE_UPDATED = "ArticleUpdated",
  COMMENT_CREATED = "CommentCreated",
  COMMENT_GET = "CommentGet",
  COMMENT_EDITED = "CommentEdited",
  COMMENT_DELETED = "CommentDeleted",
  COMMENT_VOTED = "CommentVoted",
  COMMENT_VOTE_INIT = "CommentVoteInited",
  COMMENT_VOTE_GET = "CommentVoteGet",
  COMMENT_VOTE_CHANGED = "CommentVoteChanged",
}
export type EventBody<T extends EventType> = (
  T extends EventType.ARTICLE_CREATED ? {
    articleId: string,
    author: string,
    name: string,
    title: string,
    content: string
  } :
  T extends EventType.ARTICLE_UPDATED ? {
    articleId: string,
    author: string,
    name: string,
    title: string,
    content: string,
    status: ArticleStatus
  } :
  T extends EventType.COMMENT_CREATED ? Comment :
  T extends EventType.COMMENT_EDITED ? Comment :
  T extends EventType.COMMENT_DELETED ? CommentKey :
  any
);
export type IEvent<T extends EventType = EventType> = {type: T, data: EventBody<T>};

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
  name: string
}
export interface ArticleEditResponse {
  name: string
}

// article serving
export interface ArticleServingResponse {
  articleId: string,
  title: string,
  content: string,
  status: string
}

// search engine
export interface ArticleSearchEngineResponse extends ArticleCreateResponse, ArticleServingResponse {}

// comments
export interface CommentKey {
  commentId: string,
  articleId: string
}
export interface Comment extends CommentKey {
  username: string,
  content: string,
}
