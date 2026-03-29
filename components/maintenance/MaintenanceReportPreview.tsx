"use client";

import { formatDate } from "@/app/(protected)/admin/funds/page";
import { sortMembers } from "@/lib/services/members";
import { formatCurrency } from "@/utils/common";

interface Props {
  data: any;
}

export default function MaintenanceReportPreview({ data }: Props) {
  if (!data || !data.records?.length) {
    return (
      <p className="text-center text-gray-500">
        No maintenance records found, try different search criteria
      </p>
    );
  }

  const { records = [], total, paid, unpaid, totalCollection } = data;

  const sorted = sortMembers([...records]);
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* 🔹 Summary */}
      <div className="p-4 border-b grid grid-cols-2 gap-2 text-sm">
        <p>Total: {total}</p>
        <p>Paid: {paid}</p>
        <p>Unpaid: {unpaid}</p>
        <p>Collection: {formatCurrency(totalCollection, true)}</p>
      </div>

      {/* 🔹 Desktop Table */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="grid grid-cols-7 font-semibold text-gray-500 px-4 py-2 bg-gray-100">
          <p>Villa</p>
          <p>Name</p>
          <p>Month/Year</p>
          <p>Amount</p>
          <p>Paid On</p>
          <p>Mode</p>
          <p>Status</p>
        </div>

        {/* Rows */}
        {sorted.map((m: any, i: number) => {
          const isPaid = m.amount > 0;
          const yearMonth = m.createdAt.toDate()?.toISOString().slice(0, 7);
          return (
            <div
              key={i}
              className={`grid grid-cols-7 px-4 py-3 border-b text-sm items-center ${
                !isPaid ? "bg-red-50" : ""
              }`}
            >
              <p className="font-semibold text-blue-600">{m.villaNo}</p>
              <p className="truncate">{m?.memberName || m?.name}</p>
              <p>{isPaid ? m?.month : yearMonth}</p>
              <p>{formatCurrency(m.amount || 0, true)}</p>
              <p className=" text-gray-600">
                {isPaid ? formatDate(m.createdAt) : "-"}
              </p>
              <p className=" text-gray-600">
                {m?.paymentMode?.toUpperCase() || "-"}
              </p>
              <p
                className={` font-medium ${
                  isPaid ? "text-green-600" : "text-red-500"
                }`}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </p>
            </div>
          );
        })}
      </div>

      {/* 🔹 Mobile Card View */}
      <div className="md:hidden divide-y">
        {sorted.map((m: any, i: number) => {
          const isPaid = m.amount > 0;

          return (
            <div
              key={i}
              className={`p-4 space-y-2 ${!isPaid ? "bg-red-50" : ""}`}
            >
              {/* Top Row */}
              <div className="flex justify-between items-center">
                <p className="font-semibold text-blue-600">Villa {m.villaNo}</p>

                <p
                  className={`text-sm font-medium ${
                    isPaid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>

              {/* Name */}
              <p className="text-sm font-medium">{m?.memberName || m?.name}</p>

              {/* Details */}
              <div className="grid grid-cols-2 text-xs text-gray-600 gap-2">
                <p>
                  Amount:{" "}
                  <span className="font-medium">
                    {formatCurrency(m.amount || 0, true)}
                  </span>
                </p>

                <p>
                  Mode:{" "}
                  <span className="font-medium">{m?.paymentMode?.toUpperCase() || "-"}</span>
                </p>

                <p>
                  Date:{" "}
                  <span className="font-medium">
                    {formatDate(m.createdAt) || "-"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
