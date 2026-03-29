"use client";

import { Loader } from "../Loader";
import MaintenanceReportPreview from "../maintenance/MaintenanceReportPreview";
import MembersReportPreview from "../members/MembersReportPreview";

export default function ReportPreview({ type, data, loading }: any) {
  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
      {type === "members" && data?.members?.length > 0 && (
        <MembersReportPreview data={data}  />
      )}

      {type === "maintenance" && (
        <MaintenanceReportPreview data={data}  />
      )}

      {type === "expenses" && (
        <>
          <p>Total: ₹{data.totalExpenses}</p>
          <p>Paid: ₹{data.totalPaid}</p>
          <p>Pending: ₹{data.pending}</p>
        </>
      )}

      {type === "funds" && (
        <>
          <p>Credit: ₹{data.totalCredit}</p>
          <p>Debit: ₹{data.totalDebit}</p>
          <p>Balance: ₹{data.closingBalance}</p>
        </>
      )}
    </div>
  );
}
