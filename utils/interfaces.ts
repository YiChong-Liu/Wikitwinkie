<<<<<<< HEAD
export interface SessionsLoginResponse {
  success: boolean;
}

export interface SessionsLoginResponseSuccessful extends SessionsLoginResponse {
  success: true,
  sessionId: string,
}

export interface SessionsLoginResponseFailed extends SessionsLoginResponse {
=======

// sessions
export interface SesssionsLoginResponse {
  success: boolean;
}
export interface SesssionsLoginResponseSuccessful extends SesssionsLoginResponse {
  success: true,
  sessionId: string,
}
export interface SesssionsLoginResponseFailed extends SesssionsLoginResponse {
>>>>>>> 44a31677858062b1b6f8bfd4487dbb5a99e3a1cb
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
