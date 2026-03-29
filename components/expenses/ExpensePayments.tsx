"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/common";
import {
  deleteExpensePayment,
  subscribeExpensePayments,
} from "@/lib/services/expenseService";
import { Loader } from "../Loader";
import { Edit, Trash2 } from "lucide-react";
import { DeleteConfirmModal } from "../DeleteConfirmModal";
import toast from "react-hot-toast";
import { formatDate } from "@/app/(protected)/admin/funds/page";

type Props = {
  expenseId: string;
  refresh?: () => void;
  onEdit?: (id: Record<string, string>) => void;
};

export const ExpensePayments = ({ expenseId, refresh, onEdit }: Props) => {
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [payments, setPayments] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const unsubscribe = subscribeExpensePayments(expenseId, (data) => {
      setPayments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [expenseId]);

  const handleDeleteConfirm = async () => {
    if (!expenseId || !deleteId) return toast?.error("No Expense Id Found");
    try {
      await deleteExpensePayment(expenseId, deleteId);
      setDeleteId("");
      toast.success("Payment deleted successfully!");
      refresh?.();
    } catch (error: any) {
      toast.error(error?.message || "Error in deleting expense");
    } finally {
      setDeleteId("");
    }
  };

  if (loading) {
    return <Loader height={20} width={60} />;
  }

  return (
    <div className="p-4 space-y-3 bg-gray-50 transition">
      {payments.length === 0 && (
        <p className="text-sm text-gray-500">No payments found</p>
      )}

      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between"
        >
          <div>
            <div className="flex gap-2 items-center justify-between">
              <p className="font-medium text-sm">
                {formatCurrency(payment.amount, true)}
              </p>

              <p className="text-xs text-gray-500">
                {formatDate(payment?.paymentDate)} •{" "}
                {payment?.paymentMode?.toUpperCase()}
              </p>
            </div>

            {payment.note && (
              <p className="text-xs text-gray-500 mt-1">{payment.note}</p>
            )}
          </div>
          <div className="flex justify-between gap-4">
            <button
              onClick={() => onEdit?.(payment)}
              className="cursor-pointer text-blue-600 hover:text-blue-700"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => setDeleteId(payment.id)}
              className="cursor-pointer text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      {deleteId && (
        <DeleteConfirmModal
          handleDelete={handleDeleteConfirm}
          handleCancel={() => setDeleteId("")}
        />
      )}
    </div>
  );
};
