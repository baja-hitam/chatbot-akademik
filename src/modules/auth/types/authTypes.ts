export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  studyProgram: string;
  email: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp_code: string;
}

export interface ResponseApi<T> {
  responseStatus: boolean;
  responseMessage: string;
  responseBody: T;
}

export interface ResponseLogin {
    user: {
        id: string;
        email: string;
        username: string;
        role: string;
    },
    access_token: string;
    token_type: string;
    is_verified: boolean;
}

export type ResponseVerifyOtp = ResponseLogin;

export interface ResponseRegister {
    id: string;
    email: string;
    username: string;
    role: string;
    is_verified: boolean;
    created_at: string;
}