"use client";

import { memo } from "react";
import { Clock, PlusCircle } from "lucide-react";
import { formatCurrency } from "@/utils/common";

type RecordType = Record<string, string | number>;

function UnpaidTable({
  data,
  defaultAmount,
  onAdd,
  selectedMonth,
}: {
  data: RecordType[];
  defaultAmount: number;
  onAdd?: (m: RecordType) => void;
  selectedMonth?: string;
}) {
  return (
    <table className="w-full text-sm bg-white rounded-xl shadow">
      <thead className="bg-gray-100">
        <tr className="text-left">
          <th className="p-3">Villa</th>
          <th className="p-3">Member</th>
          <th className="p-3">Month</th>
          <th className="p-3">Amount Due</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((m: RecordType) => (
          <tr key={m.id} className="border-t hover:bg-gray-50">
            <td className="p-3 font-medium">{m.villaNo}</td>

            <td className="p-3">{m.name}</td>

            <td className="p-3">{selectedMonth}</td>

            <td className="p-3">{formatCurrency(defaultAmount, true)}</td>

            <td className="p-3">
              <span className="text-red-600 font-medium flex gap-2 items-center">
                <Clock size={16} /> Pending
              </span>
            </td>

            <td className="p-3">
              <button
                onClick={() => onAdd?.(m)}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 cursor-pointer"
              >
                <PlusCircle size={16} />
                Add
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default memo(UnpaidTable);
