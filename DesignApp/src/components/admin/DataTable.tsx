import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/design-system/utils';

export type SortDir = 'asc' | 'desc';

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  filters?: { id: string; label: string; options: { value: string; label: string }[]; filterFn: (row: T, value: string) => boolean }[];
  pageSize?: number;
  selectable?: boolean;
  onRowAction?: (action: string, row: T) => void;
  bulkActions?: { id: string; label: string; variant?: 'danger' | 'primary' }[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  filters = [],
  pageSize = 8,
  selectable = true,
  onRowAction,
  bulkActions = [],
  emptyTitle = 'No results',
  emptyDescription = 'Try adjusting your search or filters.',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        searchKeys.some((k) => String(row[k]).toLowerCase().includes(q)),
      );
    }
    filters.forEach((f) => {
      const val = filterValues[f.id];
      if (val && val !== 'all') rows = rows.filter((row) => f.filterFn(row, val));
    });
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        rows.sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return sortDir === 'asc' ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, search, searchKeys, filterValues, filters, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(rowKey)));
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={14} className="text-[#a1a5b3]" />;
    return sortDir === 'asc' ? <ChevronUp size={14} className="text-[#0f6fec]" /> : <ChevronDown size={14} className="text-[#0f6fec]" />;
  };

  return (
    <div className="bg-white border border-[#e8eaed] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-[#e8eaed] flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between bg-[#fafbfc]">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full text-sm bg-white border border-[#e8eaed] rounded-xl pl-4 pr-4 py-2.5 focus:outline-none focus:border-[#0f6fec]/40 focus:ring-2 focus:ring-[#0f6fec]/10"
            />
          </div>
          {filters.map((f) => (
            <select
              key={f.id}
              value={filterValues[f.id] ?? 'all'}
              onChange={(e) => { setFilterValues((v) => ({ ...v, [f.id]: e.target.value })); setPage(1); }}
              className="text-sm bg-white border border-[#e8eaed] rounded-xl px-3 py-2.5 text-[#676a79] focus:outline-none focus:border-[#0f6fec]/40"
            >
              <option value="all">{f.label}: All</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
        </div>
        {selectable && selected.size > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#676a79]">{selected.size} selected</span>
            {bulkActions.map((a) => (
              <button
                key={a.id}
                type="button"
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors',
                  a.variant === 'danger'
                    ? 'bg-[#d6293e]/10 text-[#d6293e] border-transparent hover:bg-[#d6293e]/15'
                    : 'bg-[#0f6fec]/10 text-[#0f6fec] border-transparent hover:bg-[#0f6fec]/15',
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f5f6f8] text-left text-[#676a79]">
              {selectable && (
                <th className="py-3 pl-4 w-10">
                  <input type="checkbox" checked={paged.length > 0 && selected.size === paged.length} onChange={toggleAll} className="rounded border-[#d0d3d9]" />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 font-semibold" style={{ width: col.width }}>
                  {col.sortable ? (
                    <button type="button" onClick={() => toggleSort(col.key)} className="flex items-center gap-1.5 hover:text-[#14191e] transition-colors">
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {onRowAction && <th className="py-3 px-4 w-12" />}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (onRowAction ? 1 : 0)} className="py-16 text-center">
                  <p className="font-semibold text-[#14191e]">{emptyTitle}</p>
                  <p className="text-xs text-[#676a79] mt-1">{emptyDescription}</p>
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const id = rowKey(row);
                return (
                  <tr key={id} className="border-t border-[#e8eaed] hover:bg-[#fafbfc] transition-colors">
                    {selectable && (
                      <td className="py-3 pl-4">
                        <input type="checkbox" checked={selected.has(id)} onChange={() => toggleRow(id)} className="rounded border-[#d0d3d9]" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4">{col.render(row)}</td>
                    ))}
                    {onRowAction && (
                      <td className="py-3 px-4 relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === id ? null : id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#676a79] hover:bg-[#f5f6f8]"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {openMenu === id && (
                          <div className="absolute right-4 top-10 z-20 w-40 bg-white border border-[#e8eaed] rounded-xl shadow-lg py-1">
                            {['View', 'Edit', 'Suspend', 'Delete'].map((action) => (
                              <button
                                key={action}
                                type="button"
                                onClick={() => { onRowAction(action, row); setOpenMenu(null); }}
                                className={cn(
                                  'w-full text-left px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8] transition-colors',
                                  action === 'Delete' || action === 'Suspend' ? 'text-[#d6293e]' : 'text-[#14191e]',
                                )}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-[#e8eaed] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fafbfc]">
        <p className="text-xs text-[#676a79]">
          Showing <strong className="text-[#14191e]">{(currentPage - 1) * pageSize + (paged.length ? 1 : 0)}</strong>
          –<strong className="text-[#14191e]">{(currentPage - 1) * pageSize + paged.length}</strong> of{' '}
          <strong className="text-[#14191e]">{filtered.length}</strong> results
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-8 h-8 rounded-lg border border-[#e8eaed] flex items-center justify-center text-[#676a79] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2),
          ).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={cn(
                'min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-colors',
                p === currentPage ? 'bg-[#0f6fec] text-white' : 'text-[#676a79] hover:bg-white border border-transparent hover:border-[#e8eaed]',
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-8 h-8 rounded-lg border border-[#e8eaed] flex items-center justify-center text-[#676a79] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
