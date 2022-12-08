
// sessions
export interface SesssionsLoginResponse {
  success: boolean;
}
export interface SesssionsLoginResponseSuccessful extends SesssionsLoginResponse {
  success: true,
  sessionId: string,
}
export interface SesssionsLoginResponseFailed extends SesssionsLoginResponse {
  success: false,
  error: string,
}
export interface SessionsValidateSessionResponse {
  sessionValid: boolean;
}

// accountmanagement
export interface AccountManagementCheckPasswordResponse {
  success: boolean;
}
