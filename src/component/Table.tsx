import React from "react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  renderMobileItem?: (row: T, index: number) => React.ReactNode;
  footer?: React.ReactNode;
}

export function Table<T extends { id?: string | number; _id?: string | number }>({
  columns,
  data,
  onRowClick,
  loading = false,
  loadingText = "Loading...",
  emptyText = "No data found.",
  renderMobileItem,
  footer,
}: TableProps<T>) {
  if (loading) {
    return <p className="p-8 text-center text-sm text-ink/50">{loadingText}</p>;
  }

  if (data.length === 0) {
    return <p className="p-8 text-center text-sm text-ink/50">{emptyText}</p>;
  }

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-ink/50 border-b border-ink/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-2.5 font-semibold ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {data.map((row, index) => {
              const rowId = row.id ?? row._id ?? index;
              return (
                <tr
                  key={rowId}
                  className={`transition ${onRowClick ? "row-hover cursor-pointer hover:bg-beige/20" : ""}`}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-2.5 align-middle ${col.className ?? ""}`}
                    >
                      {col.render ? col.render(row, index) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      {renderMobileItem && (
        <div className="md:hidden p-4 space-y-3">
          {data.map((row, index) => renderMobileItem(row, index))}
        </div>
      )}

      {/* Optional Table Footer / Pagination */}
      {footer && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink/5">
          {footer}
        </div>
      )}
    </div>
  );
}
