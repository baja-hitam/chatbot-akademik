import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChatSessionsHistory } from '../services/chatHistoryService';
import type { ChatSessionRelationUser } from '../types/chatHistoryTypes';
import { DataTable, DataTableColumnHeader } from '../../../../components/molecules/DataTable';
import { Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';

export function ChatHistoryPage() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['chat-history-sessions'],
    queryFn: getChatSessionsHistory,
  });

  const columns = useMemo<ColumnDef<ChatSessionRelationUser>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: 'full_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Lengkap" />,
      },
      {
        accessorKey: 'username',
        header: ({ column }) => <DataTableColumnHeader column={column} title="NIM/Username" />,
      },
      {
        accessorKey: 'nama_prodi',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Prodi" />,
        cell: ({ row }) => <span>{row.original.nama_prodi || '-'}</span>,
      },
      {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Topik Percakapan" />,
        cell: ({ row }) => <span className="truncate max-w-[200px] block">{row.original.title || '-'}</span>,
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Waktu" />,
        cell: ({ row }) => <span>{new Date(row.original.created_at).toLocaleString('id-ID')}</span>,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Link
            to={`/admin/chat-history/${row.original.id}`}
            className="p-2 rounded-lg text-indigo-400 hover:bg-slate-800 transition-colors inline-block"
            title="Lihat Pesan"
          >
            <Eye size={16} />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">History Chat</h1>
        <p className="mt-1 text-sm text-slate-400">Pantau riwayat percakapan pengguna dengan chatbot</p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500 shadow-lg">
          Memuat riwayat chat...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sessions || []}
          searchKey="full_name"
          searchPlaceholder="Cari berdasarkan nama..."
        />
      )}
    </div>
  );
}
