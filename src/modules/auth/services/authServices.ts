import { httpClient, AUTH_TOKEN_KEY } from '../../../services/httpClient';
import axios from 'axios';
import type { LoginPayload, RegisterPayload, ResponseApi, VerifyOtpPayload, ResponseLogin, AuthUser, ResponseRegister,ResponseVerifyOtp } from '../types/authTypes';

const AUTH_STORAGE_KEY = 'chatbot-auth-user';

export function getStoredUser(): AuthUser | null {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  try {
    const { data: tokenData } = await httpClient.post<ResponseApi<ResponseLogin>>('/api/v1/auth/login', {
      email: payload.email,
      password: payload.password,
    });

    if (tokenData.responseBody.is_verified === false) {
      return {
        username: tokenData.responseBody.user.username,
        nama_prodi: tokenData.responseBody.user.nama_prodi || '', 
        email: tokenData.responseBody.user.email,
        full_name: tokenData.responseBody.user.full_name,
        is_verified: false,
        role: tokenData.responseBody.user.role,
      }
    }

    if (!tokenData.responseBody.access_token) {
      throw new Error('Token tidak ditemukan.');
    }

    localStorage.setItem(AUTH_TOKEN_KEY, tokenData.responseBody.access_token);

    const authUser: AuthUser = {
      username: tokenData.responseBody.user.username,
      nama_prodi: tokenData.responseBody.user.nama_prodi || '', 
      email: tokenData.responseBody.user.email,
      full_name: tokenData.responseBody.user.full_name,
      role: tokenData.responseBody.user.role,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));

    return authUser;
  } catch (error) {
    if (axios.isAxiosError<ResponseApi<{null: null}>>(error)) {
      throw new Error(error.response?.data?.responseMessage ?? 'Gagal login.', { cause: error });
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Terjadi kesalahan saat login.', { cause: error });
  }
}

export async function registerUser(payload: RegisterPayload) : Promise<ResponseApi<ResponseRegister>> {
  try {
    const response = await httpClient.post<ResponseApi<ResponseRegister>>('/api/v1/auth/register', payload);  
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ResponseApi<{null: null}>>(error)) {
      throw new Error(error.response?.data?.responseMessage ?? 'Gagal registrasi.', { cause: error });
    }
    throw new Error('Terjadi kesalahan saat registrasi.', { cause: error });
  }
}

export async function verifyOtpAndLogin(payload: VerifyOtpPayload): Promise<AuthUser> {
  try {
    const { data } = await httpClient.post<ResponseApi<ResponseVerifyOtp>>('/api/v1/auth/verify-otp', {
      email: payload.email,
      otp_code: payload.otp_code,
    });

    localStorage.setItem(AUTH_TOKEN_KEY, data.responseBody.access_token);

    const authUser: AuthUser = {
      username: data.responseBody.user.username,
      nama_prodi: data.responseBody.user.nama_prodi || '',
      full_name: data.responseBody.user.full_name,
      email: data.responseBody.user.email,
      role: data.responseBody.user.role,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  } catch (error) {
    if (axios.isAxiosError<ResponseApi<{ null: null }>>(error)) {
      throw new Error(error.response?.data?.responseMessage ?? 'Gagal memverifikasi OTP.', { cause: error });
    }
    throw new Error('Terjadi kesalahan saat memverifikasi OTP.', { cause: error });
  }
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
