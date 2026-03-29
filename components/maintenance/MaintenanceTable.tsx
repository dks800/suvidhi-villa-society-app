"use client";

import { useEffect, useState } from "react";
import { getMaintenanceList } from "@/lib/services/maintenance";
import AddMaintenanceModal from "./AddMaintenanceModal";
import { DownloadIcon, Edit, Trash2 } from "lucide-react";
import { downloadMaintenanceReceipt } from "@/utils/receiptGenerator";
import toast from "react-hot-toast";
import { Loader } from "../Loader";
import SummaryCards from "./SummaryCards";
import { getMembers } from "@/lib/services/members";
import { formatCurrency } from "@/utils/common";

export type typeSummary = {
  totalCollected: number;
  lateFees: number;
  membersPaid: number;
};

export default function MaintenanceTable({
  showFilters,
}: {
  showFilters: boolean;
}) {
  const [maintenance, setMaintenance] = useState<Record<string, string>[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "paid" | "pending"
  >("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const totalMembers = 54;
  const [recordsPerPage, setRecordsPerPage] = useState(totalMembers);
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);

  const [summary, setSummary] = useState<typeSummary>({
    totalCollected: 0,
    lateFees: 0,
    membersPaid: 0,
  });
  const [editData, setEditData] = useState<Record<string, string>>({});

  const [filters, setFilters] = useState({
    month: "",
    villa: "",
  });

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const data = await getMaintenanceList(currentMonth);
      setMaintenance(data);
      const currentMonthData = data.filter(
        (m: Record<string, string>) => m.month === currentMonth,
      );

      const totalCollected = currentMonthData.reduce(
        (sum, m: Record<string, string>) => sum + Number(m.total),
        0,
      );

      const lateFees = currentMonthData.reduce(
        (sum, m: Record<string, string>) => sum + Number(m.lateFees),
        0,
      );

      setSummary({
        totalCollected,
        lateFees,
        membersPaid: currentMonthData.length,
      });
    } catch {
      toast.error("Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingMembers = async () => {
    const members = await getMembers();

    const currentMonth = new Date().toISOString().slice(0, 7);

    const paidVillaNos = maintenance
      .filter((m) => m.month === currentMonth)
      .map((m) => m.villaNo);

    const pendingMembers = members.filter(
      (member) => !paidVillaNos.includes(member.villaNo),
    );
    setPendingMembers(pendingMembers);
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  useEffect(() => {
    if (paymentFilter === "pending") {
      fetchPendingMembers();
    }
  }, [paymentFilter]);

  const handleEdit = async (data: Record<string, string>) => {
    setEditData(data);
    setOpen(true);
  };

  const handleDelete = (id: string) => {};

  const downloadReceipt = (m: any) => {
    downloadMaintenanceReceipt(m);
  };

  const filteredMaintenance = maintenance.filter((m) => {
    const matchMonth = filters?.month ? m.month === filters.month : true;

    const matchVilla = filters?.villa
      ? m.villaNo?.toLowerCase().includes(filters.villa.toLowerCase())
      : true;

    const matchPayment =
      paymentFilter === "paid"
        ? true
        : paymentFilter === "pending"
          ? false
          : true;

    return matchMonth && matchVilla && matchPayment;
  });

  const totalPages = Math.ceil(filteredMaintenance.length / recordsPerPage);

  const paginatedMaintenance = filteredMaintenance.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage,
  );

  const displayRecords =
    paymentFilter === "pending" ? pendingMembers : paginatedMaintenance;

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* FILTERS */}
      {showFilters && (
        <div className="mb-4 transition-all duration-300">
          <p className="text-lg mb-2">Filters:</p>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="month"
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />

            <input
              placeholder="Search Villa No"
              value={filters.villa}
              onChange={(e) =>
                setFilters({ ...filters, villa: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200  bg-white"
            />

            <button
              onClick={() => setFilters({ month: "", villa: "" })}
              className="px-4 py-2 border rounded-xl bg-blue-200 cursor-pointer hover:bg-blue-300 transition border-blue-300"
            >
              Reset
            </button>
          </div>
        </div>
      )}
      <div>
        {/* SUMMARY CARDS */}
        {/* {summary && (
          <SummaryCards
            data={summary}
            onFilterChange={(type) => setPaymentFilter(type)}
          />
        )} */}

        <p className="text-sm text-gray-500 mb-2">
          Showing {displayRecords?.length} records
        </p>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.month && (
            <span className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm hover:bg-indigo-200 transition cursor-pointer">
              Month: {filters.month}
              <button
                onClick={() => setFilters({ ...filters, month: "" })}
                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          {filters.villa && (
            <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition cursor-pointer">
              Villa: {filters.villa}
              <button
                onClick={() => setFilters({ ...filters, villa: "" })}
                className="text-green-600 hover:text-green-900 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {/* TABLE */}
        <table className="hidden md:table w-full text-sm bg-white shadow rounded-2xl">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">Villa</th>
              <th className="p-3">Member</th>
              <th className="p-3">Month</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Prev Due</th>
              <th className="p-3">Late Fees</th>
              <th className="p-3">Total</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayRecords?.length === 0 && !loading && (
              <tr>
                <td colSpan={9} className="text-center p-6 text-gray-500">
                  No maintenance records found
                </td>
              </tr>
            )}

            {displayRecords?.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{m.villaNo}</td>

                <td className="p-3">{m.memberName}</td>

                <td className="p-3">{m.month}</td>

                <td className="p-3">₹{m.amount}</td>

                <td className="p-3">₹{m.prevDue}</td>

                <td className="p-3">₹{m.lateFees}</td>

                <td className="p-3 font-semibold text-green-600">₹{m.total}</td>

                <td className="p-3 capitalize">
                  {m?.paymentMode?.toUpperCase()}
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => downloadReceipt(m)}
                    className="text-green-600 cursor-pointer hover:text-green-800"
                    title="Download Receipt"
                  >
                    <DownloadIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-40 bg-accent-300 hover:bg-accent-400 transition cursor-pointer disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-40 bg-blue-300 hover:bg-blue-400 transition cursor-pointer  disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* MOBILE MAINTENANCE CARDS */}
        <div className="md:hidden border-t p-3">
          <div className="flex flex-wrap gap-2">
            {paginatedMaintenance.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMaintenance(m)}
                className="w-[18%] min-w-[60px] bg-white rounded-lg shadow border flex flex-col cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="text-center text-sm font-semibold py-1 text-gray-700">
                  {m.villaNo}
                </div>

                <div className="text-[10px] text-center text-gray-400">
                  {m.month}
                </div>

                <div className="text-center text-xs font-semibold text-green-600 py-1">
                  {formatCurrency(m.total, true)}
                </div>
              </div>
            ))}
          </div>

          {paginatedMaintenance.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No maintenance records found
            </p>
          )}
        </div>
      </div>

      {open && (
        <AddMaintenanceModal
          type="edit"
          open={open}
          data={editData}
          handleModalClose={() => setOpen(false)}
        />
      )}

      {/* Maintenance Detail Modal */}
      {selectedMaintenance && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Villa {selectedMaintenance.villaNo}
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Member:</span>{" "}
                {selectedMaintenance.memberName}
              </p>

              <p>
                <span className="font-medium">Month:</span>{" "}
                {selectedMaintenance.month}
              </p>

              <p>
                <span className="font-medium">Amount:</span> ₹
                {selectedMaintenance.amount}
              </p>

              <p>
                <span className="font-medium">Previous Due:</span> ₹
                {selectedMaintenance.prevDue}
              </p>

              <p>
                <span className="font-medium">Late Fees:</span> ₹
                {selectedMaintenance.lateFees}
              </p>

              <p className="text-green-600 font-semibold">
                Total: ₹{selectedMaintenance.total}
              </p>

              <p>
                <span className="font-medium">Payment Mode:</span>{" "}
                {selectedMaintenance.paymentMode}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setSelectedMaintenance(null);
                  handleEdit(selectedMaintenance);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>

              <button
                onClick={() => downloadReceipt(selectedMaintenance)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Receipt
              </button>

              <button
                onClick={() => setSelectedMaintenance(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
