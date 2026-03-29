"use client";

import {
  downloadFundsLedger,
  TransactionType,
} from "@/utils/downloadFundsLedger";
import { X } from "lucide-react";
import { useState } from "react";

export default function DownloadFundsModal({
  year,
  transactions,
  onClose,
}: {
  year: string;
  transactions: TransactionType[];
  onClose: () => void;
}) {
  const [month, setMonth] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl space-y-4 w-full max-w-sm">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Download Funds Ledger ({year})</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <button
          onClick={() => downloadFundsLedger(year, month, transactions, "full")}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg cursor-pointer hover:bg-[var(--color-primary-hover)]"
        >
          Full Ledger
        </button>

        <button
          onClick={() =>
            downloadFundsLedger(year, month, transactions, "credit")
          }
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white py-2 rounded-lg"
        >
          Credit Only
        </button>

        <button
          onClick={() =>
            downloadFundsLedger(year, month, transactions, "debit")
          }
          className="w-full bg-red-600  hover:bg-red-700 cursor-pointer text-white py-2 rounded-lg"
        >
          Debit Only
        </button>

        <button
          onClick={onClose}
          className="w-full border py-2 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
