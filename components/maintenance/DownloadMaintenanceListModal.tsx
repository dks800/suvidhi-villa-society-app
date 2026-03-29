"use client";

import { useState } from "react";
import { downloadMaintenanceList } from "@/utils/downloadMaintenanceList";

type Props = {
  month: string;
  paidMembers: Record<string, string | number>[];
  unpaidMembers: Record<string, string>[];
  onClose: () => void;
};

export const DownloadMaintenanceListModal = ({
  month,
  paidMembers,
  unpaidMembers,
  onClose,
}: Props) => {
  const [type, setType] = useState<"full" | "paid" | "unpaid" | "">("");

  const handleCancel = () => {
    onClose();
  };

  const handleDownload = () => {
    if (!type) return;
    downloadMaintenanceList(month, paidMembers, unpaidMembers, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-lg font-semibold text-[var(--color-darktext)]">
          Download Maintenance List
        </h2>

        {/* SELECT OPTION */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Select List Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "full" | "paid" | "unpaid")
            }
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Option</option>
            <option value="full">Full List</option>
            <option value="paid">Paid List</option>
            <option value="unpaid">Unpaid List</option>
          </select>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border cursor-pointer hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={!type}
            className="cursor-pointer px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
