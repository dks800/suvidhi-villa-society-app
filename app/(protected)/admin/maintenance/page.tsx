"use client";

import PaidAccordion from "@/components/maintenance/PaidAccordion";
import SummaryCards from "@/components/maintenance/SummaryCards";
import UnpaidAccordion from "@/components/maintenance/UnpaidAccordion";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { Loader } from "@/components/Loader";
import MaintenanceProgress from "@/components/maintenance/MaintenanceProgress";
import AddMaintenanceModal from "@/components/maintenance/AddMaintenanceModal";
import { useState } from "react";
import { DownloadIcon, PlusCircle } from "lucide-react";
import { DownloadMaintenanceListModal } from "@/components/maintenance/DownloadMaintenanceListModal";
import { sortMembers } from "@/lib/services/members";

export default function MaintenancePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDownloadListModal, setShowDownloadListModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const {
    currentMonthMaintenance,
    unpaidMembers,
    loading,
    memberList,
    societyDetails,
  } = useMaintenanceData(selectedMonth);

  const paidMaintenanceList = sortMembers(currentMonthMaintenance as any);
  const unpaidMaintenanceList = sortMembers(unpaidMembers as any)

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Maintenance</h2>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg flex gap-2 items-center cursor-pointer hover:bg-[var(--color-primary-hover)]"
          >
            <PlusCircle size={16} /> Add Maintenance
          </button>
          <button
            onClick={() => setShowDownloadListModal(true)}
            className="bg-[var(--color-accent)] text-[var(--color-dark)] px-4 py-2 rounded-lg flex gap-2 items-center cursor-pointer hover:bg-[var(--color-accent-hover)]"
          >
            <DownloadIcon size={16} /> List
          </button>
        </div>
      </div>
      <SummaryCards
        maintenance={currentMonthMaintenance}
        unpaid={unpaidMembers}
      />
      <MaintenanceProgress
        paidMembers={currentMonthMaintenance?.length || 0}
        unPaidMembers={unpaidMembers?.length || 0}
        monthlyAmount={600}
      />

      <PaidAccordion data={paidMaintenanceList} />

      <UnpaidAccordion
        data={unpaidMaintenanceList}
        memberList={memberList}
        selectedMonth={selectedMonth}
        societyDetails={societyDetails}
      />
      {showAddModal && (
        <AddMaintenanceModal
          type="add"
          maintenanceAmountDB={societyDetails?.maintenance}
          memberList={memberList}
          open={showAddModal}
          handleModalClose={() => setShowAddModal(false)}
        />
      )}
      {showDownloadListModal && (
        <DownloadMaintenanceListModal
          month={selectedMonth}
          paidMembers={paidMaintenanceList}
          unpaidMembers={unpaidMaintenanceList}
          onClose={() => setShowDownloadListModal(false)}
        />
      )}
    </div>
  );
}
