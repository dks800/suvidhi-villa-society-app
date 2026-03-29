"use client";

import React from "react";
import { FileText, Receipt, Wallet, PersonStanding } from "lucide-react";

export type ReportType = "members" | "maintenance" | "expenses" | "funds";

interface Props {
  value: ReportType;
  onChange: (val: ReportType) => void;
}

const options = [
  {
    label: "Members",
    value: "members",
    icon: PersonStanding,
  },
  {
    label: "Maintenance",
    value: "maintenance",
    icon: FileText,
  },
  {
    label: "Expenses",
    value: "expenses",
    icon: Receipt,
  },
  {
    label: "Funds Ledger",
    value: "funds",
    icon: Wallet,
  },
];

export default function ReportSelector({ value, onChange }: Props) {
  return (
    <div className="gap-2 flex items-center flex-wrap">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value as ReportType)}
            className={`cursor-pointer p-4 rounded-2xl border flex items-center gap-4 transition ${
              active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-2 rounded-xl ${
                active ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              <Icon size={20} />
            </div>

            <div className="text-left">
              <p className="font-semibold">{opt.label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}