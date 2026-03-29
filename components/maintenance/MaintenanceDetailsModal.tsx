import { formatDate } from "@/app/(protected)/admin/funds/page";
import { formatCurrency } from "@/utils/common";
import { downloadMaintenanceReceipt } from "@/utils/receiptGenerator";
import { Download, Edit, Trash, X } from "lucide-react";

const MaintenanceDetailsModal = ({
  selectedMaintenance,
  handleClose,
  handleEdit,
  handleDelete,
}: {
  selectedMaintenance: Record<string, string | number>;
  handleClose: () => void;
  handleEdit: () => void;
  handleDelete: (id: string) => void;
}) => {
  const maintenanceData = [
    {
      label: "Amount",
      value: formatCurrency(selectedMaintenance.amount, true),
      labelClass: "text-gray-500",
      valueClass: "font-semibold text-base",
    },
    {
      label: "Previous Due",
      value: formatCurrency(selectedMaintenance.prevDue, true),
      labelClass: "text-gray-500",
      valueClass: "font-semibold text-base",
    },
    {
      label: "Late Fees",
      value: formatCurrency(selectedMaintenance.lateFees, true),
      labelClass: "text-gray-500",
      valueClass: "font-semibold text-base",
    },
    {
      label: "Total",
      value: formatCurrency(selectedMaintenance.total, true),
      labelClass: "text-gray-700 font-medium",
      valueClass: "font-bold text-lg text-green-600",
    },
  ];

  const memberData = [
    {
      label: "Name",
      value: selectedMaintenance.memberName,
    },
    {
      label: "Paid On",
      value: formatDate(selectedMaintenance.createdAt as string),
    },
    {
      label: "Month",
      value: selectedMaintenance.month,
    },
    {
      label: "Mode",
      value:
        String(selectedMaintenance.paymentMode || "")?.toUpperCase() || "N/A",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-4 bg-green-100 px-2 py-1 rounded-lg text-green-700">
            Villa No. {selectedMaintenance.villaNo}
          </h2>
          <X className="relative top-[-10px]" onClick={handleClose} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2 justify-between flex">
            {memberData.map((item, index) => (
              <p key={index}>
                <span className="font-medium">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
          <div className="bg-white rounded-xl py-4 space-y-4 text-sm">
            {maintenanceData.map((item, index) => (
              <div
                key={index}
                className={`flex gap-2 items-center justify-between ${index === maintenanceData.length - 1 ? "border-t pt-3" : ""}`}
              >
                <span className={item.labelClass}>{item.label}</span>
                <span className={item.valueClass}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-2 gap-2">
          <button
            onClick={handleEdit}
            className="px-2 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </button>

          <button
            onClick={() => handleDelete(selectedMaintenance?.id as string)}
            className="px-2 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition flex items-center gap-1"
          >
            <Trash size={16} />
            Delete
          </button>

          <button
            onClick={() => downloadMaintenanceReceipt(selectedMaintenance)}
            className="px-2 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-1"
          >
            <Download size={16} />
            Receipt
          </button>

          <button
            onClick={handleClose}
            className="px-2 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetailsModal;
