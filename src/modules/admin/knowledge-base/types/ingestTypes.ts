export interface IngestedFile {
  filename: string;
  kd_prodi?: number | null;
  nama_prodi?: string | null;
  category?: string | null;
  document_year?: number | null;
  is_latest?: boolean | null;
}

export interface CollectionInfo {
  collection_name: string;
  document_count: number;
  categories: string[];
}

export interface IngestResponse {
  message: string;
  filename: string;
  category: string;
  chunks_created: number;
  processing_time: number;
  document_year?: number | null;
  is_latest: boolean;
  supersedes_count: number;
  ocr_used: boolean;
}

export interface IngestDeleteResponse {
  deleted_chunks: number;
}

export interface IngestPayload {
  file: FileList;
  category: string;
  kdProdi?: number | string;
}
