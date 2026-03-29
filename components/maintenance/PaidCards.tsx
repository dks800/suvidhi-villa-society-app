"use client";

import { memo } from "react";

type RecordType = Record<string, string | number>;

function PaidCards({
  data,
  onClick,
}: {
  data: RecordType[];
  onClick?: (m: Record<string, string | number>) => void;
}) {
  if (!data.length)
    return <p className="text-center text-gray-500">No paid records</p>;

  const handleClick = (m: RecordType) => {
    if (onClick) onClick(m);
  };

  return (
    <div className="space-y-3  flex flex-row gap-2 items-start">
      {data.map((m: RecordType) => {
        const totalAmount =
          Number(m.amount || 0) +
          Number(m.lateFee || 0) +
          Number(m.prevDue || 0);
        return (
          <div
            key={m.id}
            onClick={() => handleClick(m)}
            className="bg-green-50 shadow rounded-xl p-2 overflow-hidden min-w-[50px] text-center"
          >
            <span className="text-3xl font-bold text-green-800 right-2 top-3 opacity-80 text-center">
              {m.villaNo}
            </span>
            <span className="text-xs text-green-700 block opacity-60 pt-1">
              {totalAmount.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default memo(PaidCards);
