"use client";

import { memo, useMemo } from "react";
import { formatCurrency } from "@/utils/common";

type RecordType = Record<string, string | number>;

interface Props {
  maintenance: RecordType[];
  unpaid: RecordType[];
}

function SummaryCards({ maintenance, unpaid }: Props) {
  const summary = useMemo(() => {
    const totalCollected = maintenance.reduce(
      (sum, m) => sum + Number(m.total || 0),
      0
    );

    const lateFees = maintenance.reduce(
      (sum, m) => sum + Number(m.lateFees || 0),
      0
    );

    return {
      totalCollected,
      lateFees,
      membersPaid: maintenance.length,
      pendingMembers: unpaid.length,
    };
  }, [maintenance, unpaid]);

  const cards = [
    {
      label: "Total Collected",
      value: formatCurrency(summary.totalCollected, true),
      bg: "bg-green-100",
      text: "text-green-700",
    },
    {
      label: "Late Fees",
      value: formatCurrency(summary.lateFees, true),
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`${c.bg} rounded-xl shadow p-4 flex flex-col items-center`}
        >
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className={`text-xl font-semibold ${c.text}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

export default memo(SummaryCards);