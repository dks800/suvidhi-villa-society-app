"use client";

import { createExpense } from "@/lib/services/expenseService";
import { User } from "firebase/auth";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  refresh?: () => void;
  user: User;
};

export const AddExpenseModal = ({ open, onClose, refresh, user }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    notes: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "cash",
    paidBy: "",
    note: "",
  });

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.paymentDate) {
      return toast.error("Please fill required fields");
    }
    if (!form.paidBy) {
      return toast.error("Paid By is required");
    }
    try {
      setLoading(true);
      await createExpense({
        title: form.title,
        notes: form.notes,
        payment: {
          amount: Number(form.amount),
          paymentDate: new Date(form.paymentDate),
          paymentMode: form?.paymentMode?.toUpperCase(),
          note: form.note,
          paidBy: form.paidBy,
        },
        user,
      });
      toast.success("Expense Added Successfully!");
      refresh?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl m-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-darktext)]">
            Add Expense
          </h2>
          <X
            height={20}
            width={20}
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Expense Name"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />

          <textarea
            placeholder="Comments"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        <div className="border-t space-y-3">
          <p className="text-sm font-medium text-gray-600 pt-4">
            First Payment
          </p>

          <input
            type="number"
            min={0}
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />

          <input
            type="date"
            value={form.paymentDate}
            onChange={(e) => handleChange("paymentDate", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />

          <select
            value={form.paymentMode}
            onChange={(e) => handleChange("paymentMode", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>

          <input
            type="text"
            placeholder="Paid By"
            value={form.paidBy}
            onChange={(e) => handleChange("paidBy", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />

          <input
            type="text"
            placeholder="Payment Note"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="cursor-pointer px-5 py-2 rounded-xl bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};
