import { httpClient } from '../../../../services/httpClient';
import type { ResponseApi } from '../../../auth/types/authTypes';
import type { IngestedFile, CollectionInfo, IngestResponse, IngestDeleteResponse, IngestPayload } from '../types/ingestTypes';

export async function getIngestedFiles(): Promise<IngestedFile[]> {
  const { data } = await httpClient.get<ResponseApi<IngestedFile[]>>('/api/v1/ingest/files');
  return data.responseBody || [];
}

export async function getCollectionInfo(): Promise<CollectionInfo> {
  const { data } = await httpClient.get<CollectionInfo>('/api/v1/ingest/info');
  return data;
}

export async function deleteDocument(filename: string): Promise<ResponseApi<IngestDeleteResponse>> {
  const { data } = await httpClient.delete<ResponseApi<IngestDeleteResponse>>(`/api/v1/ingest/${filename}`);
  return data;
}

export async function ingestDocument(payload: IngestPayload): Promise<ResponseApi<IngestResponse>> {
  const formData = new FormData();
  formData.append('file', payload.file[0]);
  formData.append('category', payload.category);
  formData.append('kd_prodi', String(payload.kdProdi));

  const { data } = await httpClient.post<ResponseApi<IngestResponse>>('/api/v1/ingest', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}
