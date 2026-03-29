import { useState } from "react";
import PaidCards from "./PaidCards";
import PaidTable from "./PaidTable";
import AddMaintenanceModal from "./AddMaintenanceModal";
import MaintenanceDetailsModal from "./MaintenanceDetailsModal";
import { DeleteConfirmModal } from "../DeleteConfirmModal";
import { deleteMaintenance } from "@/lib/services/maintenance";
import toast from "react-hot-toast";

export default function PaidAccordion({
  data,
}: {
  data: Record<string, string>[];
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<
    Record<string, string | number>
  >({} as Record<string, string | number>);

  const handleShowDetails = (m: Record<string, string | number>) => {
    setShowDetails(true);
    setSelectedRecord(m);
  };

  const handleModalClose = () => {
    setShowDetails(false);
    setShowAddEditModal(false);
    setSelectedRecord({} as Record<string, string>);
  };

  const handleEdit = (row?: Record<string, string | number>) => {
    if (row) {
      setSelectedRecord(row);
    }
    setShowDetails(false);
    setShowAddEditModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteCall = async () => {
    if (!deleteId) return;

    try {
      await deleteMaintenance(deleteId);
      toast.success("Record deleted successfully");
      setDeleteId("");
    } catch (err) {
      toast.error("Failed to delete record");
      console.error("err --->>", err);
    }
  };

  return (
    <>
      <details open className="bg-white rounded-xl shadow">
        <summary className="p-4 cursor-pointer font-semibold">
          Paid Members ({data.length})
        </summary>

        <div className="p-4">
          <div className="hidden md:block">
            <PaidTable
              data={data}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>

          <div className="md:hidden">
            <PaidCards data={data} onClick={handleShowDetails} />
          </div>
        </div>
      </details>
      {showAddEditModal && (
        <AddMaintenanceModal
          type="edit"
          open={showAddEditModal}
          handleModalClose={handleModalClose}
          data={selectedRecord}
        />
      )}
      {showDetails && selectedRecord && (
        <MaintenanceDetailsModal
          selectedMaintenance={selectedRecord}
          handleClose={handleModalClose}
          handleEdit={handleEdit}
          handleDelete={handleDeleteClick}
        />
      )}
      {deleteId && (
        <DeleteConfirmModal
          handleDelete={handleDeleteCall}
          handleCancel={() => setDeleteId("")}
        />
      )}
    </>
  );
}
