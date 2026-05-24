import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { getProdisUtils } from '../../prodi/services/prodiService';
import type { User, UserPayload, UserUpdatePayload } from '../types/userTypes';
import { Button } from '../../../../components/atoms/Button';
import { Modal } from '../../../../components/atoms/Modal';
import { SelectSearch } from '../../../../components/molecules/SelectSearch';
import { Edit2, Trash2, Plus, Check, X } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '../../../../components/molecules/DataTable';

export function UserPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm<UserPayload>({
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      role: 'prodi',
      password: '',
      kd_prodi: undefined,
    }
  });

  const role = watch('role');
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: prodiOptions } = useQuery({
    queryKey: ['prodi-utils'],
    queryFn: getProdisUtils,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsFormOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsFormOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const onSubmit = (data: UserPayload) => {
    if (editingUser) {
      const payload: UserUpdatePayload = {
        username: data.username,
        full_name: data.full_name,
        role: data.role,
        kd_prodi: data.kd_prodi,
      };
      updateMutation.mutate({ id: editingUser.id, payload });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: '',
      kd_prodi: user.kd_prodi ?? undefined,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    reset({
      username: '',
      full_name: '',
      email: '',
      role: 'prodi',
      password: '',
      kd_prodi: undefined,
    });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const roleOptions = [
    { label: 'Prodi', value: 'prodi' },
    { label: 'Administrator', value: 'admin' },
  ];

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: 'username',
        header: ({ column }) => <DataTableColumnHeader column={column} title="NIM/NIP/Username" />,
      },
      {
        accessorKey: 'full_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Lengkap" />,
      },
      {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      },
      {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => (
          <span className="capitalize px-2 py-1 bg-slate-800 rounded-md text-xs border border-slate-700 text-slate-300">
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: 'nama_prodi',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Prodi" />,
        cell: ({ row }) => <span>{row.original.nama_prodi || '-'}</span>,
      },
      {
        accessorKey: 'is_verified',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
        cell: ({ row }) => (
          row.original.is_verified ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-md">
              <Check size={12} /> Ya
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-md">
              <X size={12} /> Tidak
            </span>
          )
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 rounded-lg text-indigo-400 hover:bg-slate-800 transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="p-2 rounded-lg text-rose-400 hover:bg-slate-800 transition-colors"
              title="Hapus"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const requireProdi = role === 'student' || role === 'prodi';

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manajemen Pengguna</h1>
          <p className="mt-1 text-sm text-slate-400">Kelola data pengguna sistem</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Tambah Pengguna
        </Button>
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={handleCancel} 
        title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">NIM/NIP</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: 'Username wajib diisi' }}
              render={({ field }) => (
                <input
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value;
                    if(value.match(/^[0-9]*$/)){
                      field.onChange(value);
                    } 
                  }}
                  placeholder='Masukkan NIP/NIM...'
                  value={field.value || ''}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
            />
            {errors.username && <span className="text-xs text-rose-400">{errors.username.message}</span>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Nama Lengkap</label>
            <input
              type="text"
              placeholder='Masukkan Nama Lengkap...'
              {...register('full_name', { required: 'Nama Lengkap wajib diisi' })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.full_name && <span className="text-xs text-rose-400">{errors.full_name.message}</span>}
          </div>

          {!editingUser && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                placeholder='Masukkan Email...'
                {...register('email', { required: !editingUser ? 'Email wajib diisi' : false })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
              {errors.email && <span className="text-xs text-rose-400">{errors.email.message}</span>}
            </div>
          )}
          
          {!editingUser && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                type="password"
                placeholder='Masukkan Password...'
                {...register('password', { required: 'Password wajib diisi' })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.password && <span className="text-xs text-rose-400">{errors.password.message}</span>}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role wajib dipilih' }}
              render={({ field }) => (
                <SelectSearch
                  options={roleOptions}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val === 'admin') reset({ ...watch(), role: 'admin', kd_prodi: undefined });
                  }}
                />
              )}
            />
            {errors.role && <span className="text-xs text-rose-400">{errors.role.message}</span>}
          </div>

          {requireProdi && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">Program Studi</label>
              <Controller
                name="kd_prodi"
                control={control}
                rules={{ required: 'Program Studi wajib dipilih untuk role ini' }}
                render={({ field }) => (
                  <SelectSearch
                    options={prodiOptions ?? []}
                    value={field.value ?? null}
                    onChange={field.onChange}
                    placeholder="Pilih prodi..."
                  />
                )}
              />
              {errors.kd_prodi && <span className="text-xs text-rose-400">{errors.kd_prodi.message}</span>}
            </div>
          )}

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
          Memuat data pengguna...
        </div>
      ) : (
        <DataTable columns={columns} data={users || []} searchKey="full_name" searchPlaceholder="Cari nama pengguna..." />
      )}
    </div>
  );
}
