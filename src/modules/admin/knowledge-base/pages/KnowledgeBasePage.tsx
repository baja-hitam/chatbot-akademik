import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getIngestedFiles, getCollectionInfo, deleteDocument, ingestDocument } from '../services/ingestService';
import { getProdisUtils } from '../../prodi/services/prodiService';
import type { IngestedFile } from '../types/ingestTypes';
import { Button } from '../../../../components/atoms/Button';
import { Modal } from '../../../../components/atoms/Modal';
import { Trash2, UploadCloud, FileText, Database } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '../../../../components/molecules/DataTable';
import { SelectSearch } from '../../../../components/molecules/SelectSearch';
import { Badge } from '../../../../components/atoms/Badge';

const DOCUMENT_CATEGORIES = [
  { value: 'buku_kurikulum', label: 'Buku Kurikulum' },
  { value: 'kalender_akademik', label: 'Kalender Akademik' },
  { value: 'pedoman_penulisan_ta_kkp', label: 'Pedoman Penulisan TA KKP' },
  { value: 'panduan_topik_kkp', label: 'Panduan Topik KKP' },
  { value: 'panduan_topik_ta', label: 'Panduan Topik TA' },
  { value: 'panduan_krs', label: 'Panduan KRS' },
  { value: 'lainnya', label: 'Lainnya' },
];

export function KnowledgeBasePage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<{
    file: FileList;
    category: string;
    kdProdi: number;
  }>({
    defaultValues: {
      category: 'lainnya',
      kdProdi: 0,
    }
  });

  const { data: collectionInfo } = useQuery({
    queryKey: ['collectionInfo'],
    queryFn: getCollectionInfo,
  });

  const { data: files, isLoading } = useQuery({
    queryKey: ['ingestedFiles'],
    queryFn: getIngestedFiles,
  });

  const { data: prodis } = useQuery({
    queryKey: ['prodisUtils'],
    queryFn: getProdisUtils,
  });

  const ingestMutation = useMutation({
    mutationFn: ingestDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingestedFiles'] });
      queryClient.invalidateQueries({ queryKey: ['collectionInfo'] });
      handleCancel();
      alert('Dokumen berhasil diunggah dan diproses.');
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      alert(`Gagal mengunggah dokumen: ${error.response?.data?.detail || error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ingestedFiles'] });
      queryClient.invalidateQueries({ queryKey: ['collectionInfo'] });
      alert(data.responseMessage)
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      alert(`Gagal menghapus dokumen: ${error.response?.data?.detail || error.message}`);
    }
  });

  const onSubmit = (data: { file: FileList; category: string; kdProdi: number }) => {
    if (!data.file || data.file.length === 0) {
      alert('Pilih file terlebih dahulu.');
      return;
    }
    ingestMutation.mutate(data);
  };

  const handleDelete = (filename: string) => {
    if (window.confirm(`Yakin ingin menghapus dokumen '${filename}' dari knowledge base?`)) {
      deleteMutation.mutate(filename);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    reset({
      category: 'lainnya',
      kdProdi: 0,
    });
  };

  const columns = useMemo<ColumnDef<IngestedFile>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: 'filename',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama File" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl truncate" title={row.original.filename}>
            <FileText size={16} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{row.original.filename}</span>
          </div>
        )
      },
      {
        accessorKey: 'category',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
        cell: ({ row }) => (
          <Badge variant="secondary" className="capitalize">
            {row.original.category?.replace(/_/g, ' ') || '-'}
          </Badge>
        )
      },
      {
        accessorKey: 'nama_prodi',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Prodi" />,
        cell: ({ row }) => <span>{row.original.nama_prodi || 'Global'}</span>
      },
      {
        accessorKey: 'document_year',
        header: 'Tahun',
        cell: ({ row }) => <span>{row.original.document_year || '-'}</span>
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleDelete(row.original.filename)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors"
                title="Hapus Dokumen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Knowledge Base</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola dokumen sumber untuk Chatbot AI.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <UploadCloud size={16} className="mr-2" /> Ingest Dokumen
        </Button>
      </div>

      {collectionInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex items-center gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-lg text-indigo-400">
              <Database size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Dokumen</p>
              <p className="text-2xl font-bold text-slate-100">{collectionInfo.document_count}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Kategori Aktif</p>
              <p className="text-2xl font-bold text-slate-100">{collectionInfo.categories?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      <Modal 
        isOpen={isFormOpen} 
        onClose={handleCancel} 
        title="Upload & Ingest Dokumen"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">File Dokumen (PDF, MD, TXT)</label>
            <input
              type="file"
              accept=".pdf,.md,.txt,.markdown"
              {...register('file', { required: 'File wajib dipilih' })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.file && <p className="mt-1 text-xs text-red-400">{errors.file.message}</p>}
            <p className="mt-1 text-xs text-slate-500">Maksimal ukuran file: 50MB.</p>
          </div>
          
          <div>
            <label className="mb-2 block text-sm text-slate-300">Kategori Dokumen</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  options={DOCUMENT_CATEGORIES}
                  value={field.value}
                  onChange={(val) => field.onChange(String(val))}
                  placeholder="Pilih Kategori Dokumen..."
                  searchPlaceholder="Cari Kategori..."
                />
              )}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Program Studi (Opsional)</label>
            <Controller
              name="kdProdi"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  options={[
                    { value: 0, label: 'Fakultas' },
                    ...(prodis || [])
                  ]}
                  value={field.value}
                  onChange={(val) => field.onChange(Number(val))}
                  placeholder="Cari Program Studi..."
                  searchPlaceholder="Cari Program Studi..."
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={ingestMutation.isPending}>
              Batal
            </Button>
            <Button type="submit" isLoading={ingestMutation.isPending}>
              Mulai Ingest
            </Button>
          </div>
        </form>
      </Modal>

      {isLoading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500 shadow-lg">
          Memuat data dokumen...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={files || []}
          searchKey="filename"
          searchPlaceholder="Cari nama file..."
        />
      )}
    </div>
  );
}
