"use client";

interface Props {
  fromDate: string;
  toDate: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
}

export default function ReportFilters({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white p-3 rounded-2xl border">
        <p className="text-xs text-gray-500 mb-1">From</p>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>

      <div className="bg-white p-3 rounded-2xl border">
        <p className="text-xs text-gray-500 mb-1">To</p>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  );
}