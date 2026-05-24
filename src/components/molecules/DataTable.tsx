'use no memo';

import React, { useState } from 'react';
import {
  type ColumnDef,
  type Column,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {searchKey && (
        <div className="flex items-center">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="px-6 py-4 font-medium whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-800">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center text-slate-500">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm text-slate-400">
          Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded text-slate-400 hover:bg-slate-700 hover:text-indigo-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded text-slate-400 hover:bg-slate-700 hover:text-indigo-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded text-slate-400 hover:bg-slate-700 hover:text-indigo-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded text-slate-400 hover:bg-slate-700 hover:text-indigo-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: {
  column: Column<TData, TValue>;
  title: string;
}) {
  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="flex items-center space-x-1 hover:text-slate-100 transition-colors"
    >
      <span>{title}</span>
      <ArrowUpDown className="w-3 h-3 ml-1" />
    </button>
  );
}
