import { httpClient } from '../../../../services/httpClient';
import type { ResponseApi } from '../../../auth/types/authTypes';
import type { Prodi, ProdiPayload, ProdiUtils } from '../types/prodiTypes';

export async function getProdis(): Promise<Prodi[]> {
  const { data } = await httpClient.get<ResponseApi<Prodi[]>>('/api/v1/prodi');
  return data.responseBody || [];
}

export async function getProdisUtils(): Promise<ProdiUtils[]> {
  const { data } = await httpClient.get<ResponseApi<ProdiUtils[]>>('/api/v1/prodi/utils');
  return data.responseBody || [];
}

export async function getProdi(kd_prodi: number): Promise<Prodi> {
  const { data } = await httpClient.get<ResponseApi<Prodi>>(`/api/v1/prodi/${kd_prodi}`);
  return data.responseBody;
}

export async function createProdi(payload: ProdiPayload): Promise<Prodi> {
  const { data } = await httpClient.post<ResponseApi<Prodi>>('/api/v1/prodi', payload);
  return data.responseBody;
}

export async function updateProdi(kd_prodi: number, payload: ProdiPayload): Promise<Prodi> {
  const { data } = await httpClient.put<ResponseApi<Prodi>>(`/api/v1/prodi/${kd_prodi}`, payload);
  return data.responseBody;
}

export async function deleteProdi(kd_prodi: number): Promise<void> {
  await httpClient.delete(`/api/v1/prodi/${kd_prodi}`);
}
