"use client";

import { memo } from "react";
import { Edit, Trash2, Download, Check } from "lucide-react";
import { formatCurrency } from "@/utils/common";
import { downloadMaintenanceReceipt } from "@/utils/receiptGenerator";
import { formatDate } from "@/app/(protected)/admin/funds/page";

type RecordType = Record<string, string | number>;

interface Props {
  data: RecordType[];
  onEdit?: (m: RecordType) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (m: RecordType) => void;
}

function PaidTable({ data, onEdit, onDelete, onRowClick }: Props) {
  if (data?.length < 1) {
    return (
      <div className="flex items-center justify-center">
        <p>No Maintenance Paid Yet</p>
      </div>
    );
  }
  return (
    <table className="w-full text-sm bg-white rounded-xl shadow">
      <thead className="bg-gray-100">
        <tr className="text-left">
          <th className="p-3">Villa</th>
          <th className="p-3">Member</th>
          <th className="p-3">Month</th>
          <th className="p-3">Paid On</th>
          <th className="p-3">Total</th>
          <th className="p-3">Status</th>
          <th className="p-3">Mode</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((m) => (
          <tr
            key={m.id}
            onClick={() => onRowClick?.(m)}
            className="border-t hover:bg-gray-50"
          >
            <td className="p-3 font-medium">{m.villaNo}</td>
            <td className="p-3">{m.memberName}</td>
            <td className="p-3">{m.month}</td>
            <td className="p-3">
              {formatDate(m?.createdAt as string)}
            </td>
            <td className="p-3 font-semibold text-green-600">
              {formatCurrency(m.total, true)}
            </td>

            <td className="p-3">
              <span className="text-green-600 font-medium flex gap-2 items-center">
                <Check size={16} /> Paid
              </span>
            </td>

            <td className="p-3 capitalize">
              {String(m?.paymentMode || "")?.toUpperCase()}
            </td>

            <td className="p-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onEdit?.(m)}
                className="cursor-pointer text-blue-600 hover:text-blue-700"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => onDelete?.(String(m.id))}
                className="cursor-pointer text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => downloadMaintenanceReceipt(m)}
                className="cursor-pointer text-green-600 hover:text-green-700"
              >
                <Download size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default memo(PaidTable);
