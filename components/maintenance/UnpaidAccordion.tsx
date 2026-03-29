import { useState } from "react";
import AddMaintenanceModal from "./AddMaintenanceModal";
import UnpaidCards from "./UnpaidCards";
import UnpaidTable from "./UnpaidTable";
import { typeSocietyDetails } from "@/hooks/useMaintenanceData";

type RecordType = Record<string, string | number>;

export default function UnpaidAccordion({
  data,
  memberList,
  societyDetails,
  selectedMonth,
}: {
  data: RecordType[];
  societyDetails: typeSocietyDetails;
  memberList: RecordType[];
  selectedMonth?: string;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordType>(
    {} as RecordType,
  );

  const maintenanceAmountDB = societyDetails?.maintenance;
  const handleAdd = (record: RecordType) => {
    setShowAddModal(true);
    setSelectedRecord(record);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setSelectedRecord({} as RecordType);
  };

  return (
    <>
      <details className="bg-white rounded-xl shadow">
        <summary className="p-4 cursor-pointer font-semibold">
          Unpaid Members ({data.length})
        </summary>

        <div className="p-4">
          <div className="hidden md:block">
            <UnpaidTable
              data={data}
              defaultAmount={maintenanceAmountDB}
              onAdd={handleAdd}
              selectedMonth={selectedMonth}
            />
          </div>

          <div className="md:hidden">
            <UnpaidCards
              data={data}
              defaultAmount={maintenanceAmountDB}
              onAdd={handleAdd}
            />
          </div>
        </div>
      </details>
      {showAddModal && (
        <AddMaintenanceModal
          type="add"
          maintenanceAmountDB={maintenanceAmountDB}
          memberList={memberList}
          data={selectedRecord}
          open={showAddModal}
          handleModalClose={handleModalClose}
        />
      )}
    </>
  );
}
