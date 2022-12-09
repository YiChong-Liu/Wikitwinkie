
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
