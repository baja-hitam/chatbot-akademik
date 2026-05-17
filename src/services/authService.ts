import type { AuthUser } from '../types/domain';
import { httpClient, AUTH_TOKEN_KEY } from './httpClient';
import axios from 'axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface VerifyOtpPayload {
  email: string;
  otp_code: string;
}

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
    const { data: tokenData } = await httpClient.post<{ access_token?: string; is_verified?: boolean; message?: string }>('/api/v1/auth/login', {
      email: payload.email,
      password: payload.password,
    });

    if (tokenData.is_verified === false) {
      // Create a specific error to catch in the UI to redirect to OTP
      const error = new Error('NOT_VERIFIED');
      (error as any).email = payload.email;
      throw error;
    }

    if (!tokenData.access_token) {
      throw new Error('Token tidak ditemukan.');
    }

    localStorage.setItem(AUTH_TOKEN_KEY, tokenData.access_token);

    const { data: userData } = await httpClient.get<{ email: string; username: string }>('/api/v1/auth/me');

    const authUser: AuthUser = {
      name: userData.username,
      studyProgram: 'User', // Fallback as the backend doesn't provide this yet
      email: userData.email,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_VERIFIED') {
      throw error;
    }
    if (axios.isAxiosError<{ detail?: string }>(error)) {
      throw new Error(error.response?.data?.detail ?? 'Gagal login.');
    }
    throw new Error('Terjadi kesalahan saat login.');
  }
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  try {
    await httpClient.post('/api/v1/auth/register', payload);
  } catch (error) {
    if (axios.isAxiosError<{ detail?: string }>(error)) {
      throw new Error(error.response?.data?.detail ?? 'Gagal registrasi.');
    }
    throw new Error('Terjadi kesalahan saat registrasi.');
  }
}

export async function verifyOtpAndLogin(payload: VerifyOtpPayload): Promise<AuthUser> {
  try {
    const { data: tokenData } = await httpClient.post<{ access_token: string }>('/api/v1/auth/verify-otp', {
      email: payload.email,
      otp_code: payload.otp_code,
    });

    localStorage.setItem(AUTH_TOKEN_KEY, tokenData.access_token);

    const { data: userData } = await httpClient.get<{ email: string; username: string }>('/api/v1/auth/me');

    const authUser: AuthUser = {
      name: userData.username,
      studyProgram: 'User',
      email: userData.email,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  } catch (error) {
    if (axios.isAxiosError<{ detail?: string }>(error)) {
      throw new Error(error.response?.data?.detail ?? 'Gagal memverifikasi OTP.');
    }
    throw new Error('Terjadi kesalahan saat memverifikasi OTP.');
  }
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
