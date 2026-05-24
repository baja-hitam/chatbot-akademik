import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProdis, createProdi, updateProdi, deleteProdi } from '../services/prodiService';
import type { Prodi, ProdiPayload } from '../types/prodiTypes';
import { Button } from '../../../../components/atoms/Button';
import { Modal } from '../../../../components/atoms/Modal';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '../../../../components/molecules/DataTable';

export function ProdiPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);
  const [formData, setFormData] = useState<ProdiPayload>({ nama_prodi: '' });

  const { data: prodis, isLoading } = useQuery({
    queryKey: ['prodis'],
    queryFn: getProdis,
  });

  const createMutation = useMutation({
    mutationFn: createProdi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prodis'] });
      setIsFormOpen(false);
      setFormData({ nama_prodi: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ kd_prodi, payload }: { kd_prodi: number; payload: ProdiPayload }) => updateProdi(kd_prodi, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prodis'] });
      setIsFormOpen(false);
      setEditingProdi(null);
      setFormData({ nama_prodi: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProdi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prodis'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProdi) {
      updateMutation.mutate({ kd_prodi: editingProdi.kd_prodi, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (prodi: Prodi) => {
    setEditingProdi(prodi);
    setFormData({ nama_prodi: prodi.nama_prodi });
    setIsFormOpen(true);
  };

  const handleDelete = (kd_prodi: number) => {
    if (window.confirm('Yakin ingin menghapus prodi ini?')) {
      deleteMutation.mutate(kd_prodi);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProdi(null);
    setFormData({ nama_prodi: '' });
  };

  const columns = useMemo<ColumnDef<Prodi>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: 'nama_prodi',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Prodi" />,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          const prodi = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEdit(prodi)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(prodi.kd_prodi)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors"
                title="Hapus"
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
    <div className="p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Master Prodi</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola data program studi di sini.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={16} /> Tambah Prodi
        </Button>
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={handleCancel} 
        title={editingProdi ? 'Edit Prodi' : 'Tambah Prodi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {editingProdi && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">Kode Prodi</label>
              <input
                type="text"
                disabled
                value={editingProdi.kd_prodi}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm text-slate-300">Nama Prodi</label>
            <input
              type="text"
              required
              value={formData.nama_prodi}
              onChange={(e) => setFormData({ ...formData, nama_prodi: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Batal
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {isLoading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500 shadow-lg">
          Memuat data...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={prodis || []}
          searchKey="nama_prodi"
          searchPlaceholder="Cari nama prodi..."
        />
      )}
    </div>
  );
}
