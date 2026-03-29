"use client";

import { formatDate } from "@/app/(protected)/admin/funds/page";
import { addPayment, updatePayment } from "@/lib/services/expenseService";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  expenseId: string;
  expenseName: string;
  open: boolean;
  onClose: () => void;
  editPaymentData: Record<string, string>;
  user: User;
};

export const AddPaymentModal = ({
  expenseId,
  expenseName,
  open,
  onClose,
  editPaymentData,
  user,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "cash",
    note: "",
    paidBy: "",
  });

  useEffect(() => {
    if (editPaymentData?.id) {
      const formattedDate = editPaymentData.paymentDate
        ? formatDate(editPaymentData.paymentDate)
        : "";
      setForm((prev) => ({
        ...prev,
        ...editPaymentData,
        paymentDate: formattedDate,
      }));
    }
  }, [editPaymentData]);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.amount) {
      return toast.error("Amount is required");
    }
    if (!form.paidBy) {
      return toast.error("Paid By is required");
    }

    try {
      setLoading(true);

      if (editPaymentData?.id) {
        await updatePayment(
          expenseId,
          editPaymentData?.id,
          { ...form, paymentDate: new Date(form.paymentDate) },
          user,
        );
      } else {
        await addPayment(
          expenseId,
          {
            amount: Number(form.amount),
            paymentDate: new Date(form.paymentDate),
            paymentMode: form.paymentMode?.toUpperCase(),
            note: form.note,
            paidBy: form.paidBy,
          },
          user,
        );
      }
      onClose?.();
      toast.success("Payment added successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to add Payment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-5 shadow-xl">
        <h2 className="text-lg font-semibold text-[var(--color-darktext)]">
          {editPaymentData?.id
            ? `Edit Payment of ${expenseName}`
            : `Add Payment for ${expenseName}`}
        </h2>

        <div className="space-y-3">
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            min={0}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={form.paymentDate}
            onChange={(e) => handleChange("paymentDate", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

          <select
            value={form.paymentMode}
            onChange={(e) => handleChange("paymentMode", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>

          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note || ""}
            onChange={(e) => handleChange("note", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Paid By"
            value={form.paidBy || ""}
            onChange={(e) => handleChange("paidBy", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-100 cursor-pointer "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer px-4 py-2 rounded-xl bg-green-500 text-white text-sm hover:bg-green-600 disabled:opacity-60 border border-green-600"
          >
            {loading
              ? "Saving..."
              : editPaymentData?.id
                ? "Update Payment"
                : "Add Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};
