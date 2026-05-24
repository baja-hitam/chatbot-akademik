import { httpClient } from '../../../../services/httpClient';
import type { ResponseApi } from '../../../auth/types/authTypes';
import type { User, UserPayload, UserUpdatePayload } from '../types/userTypes';

export async function getUsers(): Promise<User[]> {
  const { data } = await httpClient.get<ResponseApi<User[]>>('/api/v1/users');
  return data.responseBody || [];
}

export async function getUser(id: string): Promise<User> {
  const { data } = await httpClient.get<ResponseApi<User>>(`/api/v1/users/${id}`);
  return data.responseBody;
}

export async function createUser(payload: UserPayload): Promise<ResponseApi<void>> {
  const {data} = await httpClient.post('/api/v1/users', payload);
  return data;
}

export async function updateUser(id: string, payload: UserUpdatePayload): Promise<ResponseApi<void>> {
  const {data} = await httpClient.put(`/api/v1/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<ResponseApi<void>> {
  const {data} = await httpClient.delete(`/api/v1/users/${id}`);
  return data;
}
