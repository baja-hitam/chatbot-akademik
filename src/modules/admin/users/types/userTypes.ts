export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  kd_prodi?: number | null;
  nama_prodi?: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface UserPayload {
  username: string;
  full_name: string;
  email: string;
  role: string;
  password?: string;
  kd_prodi?: number | null;
}

export interface UserUpdatePayload {
  username?: string;
  full_name?: string;
  role?: string;
  kd_prodi?: number | null;
}
