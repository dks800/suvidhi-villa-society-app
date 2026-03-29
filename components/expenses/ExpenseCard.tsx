"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Pencil,
  PlusCircle,
} from "lucide-react";
import { formatCurrency } from "@/utils/common";
import { ExpensePayments } from "./ExpensePayments";
import { AddPaymentModal } from "./AddPaymentModal";
import { deleteExpense } from "@/lib/services/expenseService";
import { DeleteConfirmModal } from "../DeleteConfirmModal";
import toast from "react-hot-toast";
import { User } from "firebase/auth";

type Props = {
  expense: Record<string, string | number>;
  refresh?: () => void;
  user: User;
};

export const ExpenseCard = ({ expense, refresh, user }: Props) => {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [editPaymentData, setEditPaymenData] = useState<Record<string, string>>({});

  const handleDeleteClick = async () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expense.id) return toast?.error("No Expense Id Found");
    try {
      await deleteExpense(String(expense.id));
      setShowDeleteModal(false);
      toast.success("Expense deleted successfully!");
      refresh?.();
    } catch (error: any) {
      toast.error(error?.message || "Error in deleting expense");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handlePaymentEdit = (paymentData: Record<string, string>) => {
    setOpenPaymentModal(true);
    setEditPaymenData(paymentData);
  };

  const handleClose = () => {
    setOpenPaymentModal(false);
    setEditPaymenData({});
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden  border-gray-200">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between p-4 cursor-pointer"
      >
        <div>
          <p className="font-semibold text-[var(--color-darktext)] text-sm sm:text-base">
            {expense.title}
          </p>

          <p className="text-xs text-gray-500">
            {expense.paymentCount} payments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="font-semibold text-sm sm:text-base">
            {formatCurrency(expense.totalAmount, true)}
          </p>

          {open ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </div>
      </div>

      <div className="flex gap-2 px-4 justify-between mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenPaymentModal(true);
          }}
          className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-green-100 hover:bg-green-200"
        >
          <PlusCircle size={14} />
          Payment
        </button>
        <div className="flex gap-2">
          <button className=" cursor-pointer flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg bg-blue-50 hover:bg-blue-200">
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            className=" cursor-pointer flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg text-red-600 bg-red-50 hover:bg-red-200"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-gray-50 border-gray-200">
          <ExpensePayments expenseId={expense.id as string} onEdit={handlePaymentEdit} />
        </div>
      )}

      {openPaymentModal && (
        <AddPaymentModal
          expenseId={expense.id as string}
          expenseName={expense?.title as string}
          open={openPaymentModal}
          onClose={handleClose}
          editPaymentData={editPaymentData}
          user={user}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          handleDelete={handleDeleteConfirm}
          handleCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};
