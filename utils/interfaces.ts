export interface SessionsLoginResponse {
  success: boolean;
}

export interface SessionsLoginResponseSuccessful extends SessionsLoginResponse {
  success: true,
  sessionId: string,
}

export interface SessionsLoginResponseFailed extends SessionsLoginResponse {
  success: false,
  error: string,
}
