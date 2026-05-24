export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  username: string;
  nama_prodi: string;
  full_name: string;
  email: string;
  is_verified?: boolean;
  role?: string;
}

export interface RegisterPayload {
  username: string;
  full_name: string;
  email: string;
  role: string;
  password: string;
  kd_prodi: number;
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
        full_name: string;
        username: string;
        role: string;
        nama_prodi?: string;
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
    full_name: string;
    role: string;
    is_verified: boolean;
    created_at: string;
}