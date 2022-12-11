// eventbus
export enum EventType {
  COMMENT_CREATED = "CommentCreated",
  COMMENT_GET = "CommentGet",
  COMMENT_EDITED = "CommentEdited",
  COMMENT_DELETED = "CommentDeleted",
  COMMENT_VOTED = "CommentVoted",
  COMMENT_VOTE_INIT = "CommentVoteInited",
  COMMENT_VOTE_GET = "CommentVoteGet",
  COMMENT_VOTE_CHANGED = "CommentVoteChanged"
}
export interface IEvent {
  type: EventType,
  data: any
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
