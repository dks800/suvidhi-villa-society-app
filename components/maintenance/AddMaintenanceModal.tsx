"use client";

import { useAuth } from "@/lib/AuthContext";
import {
  addMaintenance,
  checkMaintenanceExists,
  updateMaintenance,
} from "@/lib/services/maintenance";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddMaintenanceModal({
  type,
  handleModalClose,
  data,
  memberList,
  maintenanceAmountDB,
}: {
  type: "add" | "edit";
  open: boolean;
  handleModalClose: () => void;
  data?: Record<string, string | number>;
  memberList?: Record<string, string | number>[];
  maintenanceAmountDB?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const { user } = useAuth();

  const filteredMembers = memberList?.filter(
    (m: Record<string, string | number>) =>
      `${m.villaNo} - ${m.name}`.toLowerCase().includes(search.toLowerCase()),
  );
  const [form, setForm] = useState({
    memberId: "",
    villaNo: "",
    memberName: "",
    month: "",
    amount: String(maintenanceAmountDB),
    prevDue: "",
    lateFees: "",
    receivedBy: "",
    paymentMode: "cash",
  });

  useEffect(() => {
    if (data) {
      const name = data.memberName || data.name || "";
      setForm({
        memberId: String(data.memberId || data.id || ""),
        villaNo: String(data.villaNo),
        memberName: String(name),
        month: String(data.month || ""),
        amount: String(data.amount || maintenanceAmountDB || 0),
        prevDue: String(data.prevDue || 0),
        lateFees: String(data.lateFees || 0),
        receivedBy: String(data.receivedBy || ""),
        paymentMode: String(data.paymentMode || "cash"),
      });
      setSearch(`${data.villaNo} - ${name}`);
    }
  }, [data, type, maintenanceAmountDB]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e?.target as HTMLElement)?.id === "search") return;
      setOpenDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const validateForm = () => {
    if (!form.month) {
      toast.error("Month is required");
      return false;
    }
    const currentMonth = new Date().toISOString().slice(0, 7);

    if (form.month > currentMonth) {
      toast.error("Future maintenance cannot be added");
      return false;
    }

    if (!form.memberId) {
      toast.error("Member not selected");
      return false;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Maintenance amount must be greater than 0");
      return false;
    }
    if (Number(form.prevDue) < 0) {
      toast.error("Previous due cannot be negative");
      return false;
    }
    if (Number(form.lateFees) < 0) {
      toast.error("Late fees cannot be negative");
      return false;
    }

    if (!form.paymentMode) {
      toast.error("Please select payment mode");
      return false;
    }
    if (!form.receivedBy) {
      toast.error("Received By is Required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const isDuplicate = data
      ? false
      : await checkMaintenanceExists(form.memberId, form.month);
    if (isDuplicate) {
      toast.error(
        `Maintenance already received for this month by ${form.memberName}`,
      );
      setLoading(false);
      return;
    }

    try {
      if (type === "add") {
        await addMaintenance(form, user!);
        toast.success("Maintenance added successfully");
      } else {
        await updateMaintenance(String(data?.id), form);
        toast.success("Maintenance updated successfully");
      }
    } catch (error: { message: string } | any) {
      toast.error(error.message || "Failed to update maintenance");
      setLoading(false);
      return;
    } finally {
      handleModalClose?.();
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--color-darktext)]">
            {type === "edit" ? "Edit Maintenance" : "Add Maintenance"}
          </h2>
          <X
            onClick={handleModalClose}
            className="cursor-pointer hover:text-gray-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            {!form.month && (
              <span className="absolute top-2 left-30">Select Month</span>
            )}
            <input
              type="month"
              placeholder="Select Month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="relative">
            <div className="relative w-full">
              <input
                type="text"
                id="search"
                disabled={memberList?.length === 0 || loading || !form.month}
                placeholder="Search Member / Villa No"
                value={search}
                onFocus={() => setOpenDropdown(true)}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 ${
                  memberList?.length === 0 || loading || !form.month
                    ? "cursor-not-allowed bg-gray-100"
                    : ""
                }`}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
                {filteredMembers?.length === 0 && (
                  <p className="p-3 text-sm text-gray-500">No member found</p>
                )}

                {filteredMembers?.map((m: Record<string, string | number>) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setForm({
                        ...form,
                        memberId: m.id as string,
                        memberName: m.name as string,
                        villaNo: m.villaNo as string,
                      });
                      setSearch(`${m.villaNo} - ${m.name}`);
                      setOpenDropdown(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-50"
                  >
                    {m.villaNo} - {m.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="relative">
            {form.amount && (
              <label className=" absolute text-sm text-gray-400 right-1 pr-2 bottom-1 pb-2 opacity-50">
                Maintenance Amount
              </label>
            )}
            <input
              placeholder="Maintenance Amount"
              type="number"
              min={0}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Previous Due */}
          <div className="relative">
            {form.prevDue && (
              <label className=" absolute text-sm text-gray-400 right-1 pr-2 bottom-1 pb-2 opacity-50">
                Previous Due
              </label>
            )}
            <input
              placeholder="Previous Due"
              value={form.prevDue}
              type="number"
              min={0}
              onChange={(e) => setForm({ ...form, prevDue: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Late Fees */}
          <div className="relative">
            {form.lateFees && (
              <label className=" absolute text-sm text-gray-400 right-1 pr-2 bottom-1 pb-2 opacity-50">
                Late Fees
              </label>
            )}
            <input
              placeholder="Late Fees"
              value={form.lateFees}
              type="number"
              min={0}
              onChange={(e) => setForm({ ...form, lateFees: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Total */}
          <div className="relative">
            <label className=" absolute text-sm text-gray-400 right-1 pr-2 bottom-1 pb-2 opacity-50">
              Total Amount
            </label>
            <input
              placeholder="Total Amount"
              value={
                Number(form.amount || 0) +
                Number(form.prevDue || 0) +
                Number(form.lateFees || 0)
              }
              type="number"
              disabled={true}
              min={0}
              onChange={(e) => setForm({ ...form, lateFees: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none disabled:bg-gray-100 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <select
              value={form.paymentMode}
              onChange={(e) =>
                setForm({ ...form, paymentMode: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          {/* Received By */}
          <div className="relative">
            {form.receivedBy && (
              <label className=" absolute text-sm text-gray-400 right-1 pr-2 bottom-1 pb-2 opacity-50">
                Received By
              </label>
            )}
            <input
              placeholder="Received By"
              value={form.receivedBy}
              type="text"
              onChange={(e) => setForm({ ...form, receivedBy: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 rounded-xl border cursor-pointer hover:bg-gray-200 border border-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-primary)] font-medium cursor-pointer disabled:opacity-60 border border-[var(--color-accent)]"
          >
            {loading ? "Saving..." : type === "edit" ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
