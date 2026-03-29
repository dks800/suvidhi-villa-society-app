"use client";

import ReportFilters from "@/components/reports/ReportFilters";
import ReportPreview from "@/components/reports/ReportPreview";
import ReportSelector, {
  ReportType,
} from "@/components/reports/ReportSelector";
import { useReportsData } from "@/hooks/useReportsData";
import { downloadMaintenanceReport } from "@/utils/downloadMaintenanceReport";
import { downloadMembersReport } from "@/utils/downloadMembersReport";
import { Download } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>("members");
  const [downloading, setDownloading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, loading } = useReportsData({
    type,
    fromDate,
    toDate,
  });

  const handleDownload = async () => {
    if (downloading) return;

    try {
      setDownloading(true);

      if (type === "members" && data?.members?.length > 0) {
        await downloadMembersReport(data.members);
      } else if (type === "maintenance" && data?.records?.length > 0) {
        await downloadMaintenanceReport(fromDate, toDate, data?.records);
      }
    } catch (err: any) {
      toast.error("Download failed - ", err?.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pb-24 space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold">📊 Reports</h1>
        <p className="text-sm text-gray-500">Generate and download reports</p>
      </div>

      <ReportSelector value={type} onChange={setType} />

      {type !== "members" && (
        <ReportFilters
          fromDate={fromDate}
          toDate={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      )}

      {/* Preview */}
      <ReportPreview type={type} data={data} loading={loading} />

      {/* Sticky Download Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleDownload}
          className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-semibold shadow-lg flex gap-2 items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={downloading}
        >
          <Download /> {downloading ? "Downloading..." : "Download Report"}
        </button>
      </div>
    </div>
  );
}
