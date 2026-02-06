import React from "react";
import { Inbox } from "lucide-react";

export type ITableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export type ITableAction<T> = {
  label?: string;
  getLabel?: (row: T) => string;
  onClick: (row: T) => void;
  className?: string;
};

export type ReusableTableProps<T> = {
  columns: ITableColumn<T>[];
  data: T[];
  actions?: ITableAction<T>[];
};

export default function ReusableTable<T>({
  columns,
  data = [],
  actions,
}: ReusableTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider ${col.className}`}
              >
                {col.label}
              </th>
            ))}

            {actions && actions.length > 0 && (
              <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)}
                className="px-6 py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-50 rounded-full p-4 mb-3">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">No records found</p>
                  <p className="text-sm text-gray-400">There are no items to display at the moment.</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all group"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-5">
                    {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                  </td>
                ))}

                {actions && (
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(row)}
                          className={action.className}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
