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
