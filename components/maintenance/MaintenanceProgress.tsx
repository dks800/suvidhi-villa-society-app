"use client";

import { memo } from "react";
import { formatCurrency } from "@/utils/common";

interface Props {
  paidMembers: number;
  unPaidMembers: number;
  monthlyAmount: number;
}

function MaintenanceProgress({
  paidMembers,
  unPaidMembers,
  monthlyAmount,
}: Props) {
  const collected = paidMembers * monthlyAmount;
  const expected = (paidMembers + unPaidMembers) * monthlyAmount;
  const percent = expected ? Math.round((collected / expected) * 100) : 0;

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>
          {formatCurrency(collected, true)} / {formatCurrency(expected, true)}
        </span>

        <span className="font-semibold text-green-600">{percent}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Maintenance Collection Progress
      </p>
    </div>
  );
}

export default memo(MaintenanceProgress);
