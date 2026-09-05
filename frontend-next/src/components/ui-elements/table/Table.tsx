import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState
} from '@tanstack/react-table';

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  pageSize?: number;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  className?: string;
}

export const Table = <TData,>({
  data,
  columns,
  enableSorting = false,
  enableFiltering = false,
  enablePagination = false,
  enableRowSelection = false,
  pageSize = 10,
  onRowSelectionChange,
  className = ''
}: TableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      state: { sorting }
    }),
    ...(enableFiltering && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      state: { columnFilters }
    }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize } }
    }),
    ...(enableRowSelection && {
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      state: { rowSelection }
    }),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility }
  });

  // 選択が変更されたときにコールバックを呼び出す
  useEffect(() => {
    if (enableRowSelection && onRowSelectionChange) {
      const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  return (
    <div className={`w-full ${className}`}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {enableRowSelection && (
                  <th className="px-6 py-4 w-14 border-b border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      aria-label="全て選択"
                      checked={table.getIsAllRowsSelected()}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = table.getIsSomeRowsSelected();
                        }
                      }}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                      className={`w-5 h-5 rounded cursor-pointer border-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors ${
                        table.getIsAllRowsSelected()
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                      style={{
                        accentColor: '#2563eb'
                      }}
                    />
                  </th>
                )}
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          enableSorting && header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700'
                            : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="text-gray-400 dark:text-gray-500">
                            {{
                              asc: ' ↑',
                              desc: ' ↓'
                            }[header.column.getIsSorted() as string] ?? ' ⇅'}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={enableRowSelection ? columns.length + 1 : columns.length}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  データがありません
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${enableRowSelection && row.getIsSelected() ? 'bg-blue-50 dark:bg-blue-900/40' : ''}`}
                >
                  {enableRowSelection && (
                    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                      <input
                        type="checkbox"
                        aria-label="行を選択"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className={`w-5 h-5 rounded cursor-pointer border-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors ${
                          row.getIsSelected()
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                        }`}
                        style={{
                          accentColor: '#2563eb'
                        }}
                      />
                    </td>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {enablePagination && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {'<'}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {'>>'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span>
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ
            </span>
            <span className="text-gray-500 dark:text-gray-400">（全 {table.getRowCount()} 件）</span>
          </div>
        </div>
      )}

      {/* 選択された行の情報 */}
      {enableRowSelection && Object.keys(rowSelection).length > 0 && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 px-4">
          {Object.keys(rowSelection).length} 行が選択されています
        </div>
      )}
    </div>
  );
};
