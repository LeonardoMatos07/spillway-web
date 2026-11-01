"use client";

import { useMemo, useState, type ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "right";
  /** Hidden below the `sm` breakpoint, so the table needs no horizontal scroll at 360 px. */
  secondary?: boolean;
  /** Value to sort by; without it the column is not sortable. */
  sortValue?: (row: T) => number | string | null;
  render: (row: T) => ReactNode;
  /** First click sorts descending (numbers) or ascending (text). */
  firstDirection?: "asc" | "desc";
}

/** The table that is the equivalent of every map: sortable headers, `aria-sort`, no side scroll. */
export function SortableTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  initialSort,
  selectedKey,
  onSelectRow,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  caption: string;
  initialSort?: { key: string; desc: boolean };
  selectedKey?: string | null;
  onSelectRow?: (key: string) => void;
}) {
  const [sort, setSort] = useState(initialSort ?? null);
  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sort?.key);
    const read = column?.sortValue;
    if (!sort || !read) return rows;
    return [...rows].sort((a, b) => {
      const x = read(a);
      const y = read(b);
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      const order =
        typeof x === "string" && typeof y === "string"
          ? x.localeCompare(y, "pt-BR")
          : Number(x) - Number(y);
      return sort.desc ? -order : order;
    });
  }, [rows, columns, sort]);

  return (
    <div className="border-grid bg-surface shadow-card rounded-2xl border">
      <table className="tabular w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-grid bg-surface-2 text-ink-2 border-b text-xs tracking-wide uppercase">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                aria-sort={
                  sort?.key === c.key ? (sort.desc ? "descending" : "ascending") : undefined
                }
                className={`px-3 py-2 font-medium ${c.secondary ? "hidden sm:table-cell" : ""} ${
                  c.align === "right" ? "text-right" : ""
                }`}
              >
                {c.sortValue ? (
                  <button
                    type="button"
                    className="hover:text-ink uppercase"
                    onClick={() =>
                      setSort((s) => ({
                        key: c.key,
                        desc: s?.key === c.key ? !s.desc : c.firstDirection !== "asc",
                      }))
                    }
                  >
                    {c.label}
                    <span aria-hidden>{sort?.key === c.key ? (sort.desc ? " ↓" : " ↑") : ""}</span>
                  </button>
                ) : (
                  c.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const key = rowKey(row);
            return (
              <tr
                key={key}
                aria-selected={selectedKey === key ? true : undefined}
                onClick={onSelectRow ? () => onSelectRow(key) : undefined}
                className={`border-grid hover:bg-surface-2 border-b last:border-0 ${
                  selectedKey === key ? "bg-accent-soft" : ""
                }`}
              >
                {columns.map((c, i) => {
                  const cls = `px-3 py-2 ${c.secondary ? "hidden sm:table-cell" : ""} ${
                    c.align === "right" ? "text-right" : ""
                  }`;
                  return i === 0 ? (
                    <th key={c.key} scope="row" className={`${cls} font-normal`}>
                      {c.render(row)}
                    </th>
                  ) : (
                    <td key={c.key} className={cls}>
                      {c.render(row)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
