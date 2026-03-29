"use client";
import { memo } from "react";

type RecordType = Record<string, string | number>;

function UnpaidCards({
  data,
  onAdd,
}: {
  data: RecordType[];
  defaultAmount: number;
  onAdd?: (m: RecordType) => void;
}) {
  if (!data.length)
    return <p className="text-center text-gray-500">No pending members</p>;

  return (
    <div className="space-y-3 flex flex-row gap-2 items-start flex-wrap">
      {data.map((m: RecordType) => (
        <div
          key={m.id}
          onClick={() => onAdd?.(m)}
          className="bg-red-50 shadow rounded-xl p-2 overflow-hidden min-w-[50px] text-center"
        >
          <span className="text-3xl font-bold text-red-800 right-2 top-3 opacity-80 text-center">
            {m.villaNo}
          </span>
        </div>
      ))}
    </div>
  );
}

export default memo(UnpaidCards);
