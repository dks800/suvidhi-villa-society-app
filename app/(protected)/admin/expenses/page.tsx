"use client";

import { useState } from "react";
import { useExpensesData } from "@/hooks/useExpensesData";
import { ExpensesSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { PlusCircle } from "lucide-react";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { useAuth } from "@/lib/AuthContext";
import { Loader } from "@/components/Loader";

export default function ExpensesPage() {
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const { user } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const { expenses, totalExpenses, currentMonthExpenses, loading } =
    useExpensesData(selectedMonth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-row items-center justify-between gap-4 flex-wrap  ">
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-darktext)]">
          Society Expenses (
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
          }).format(new Date(selectedMonth))}
          )
        </h1>

        <div className="flex gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm"
          />

          <button
            onClick={() => setOpenExpenseModal(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm hover:bg-[var(--color-primary-hover)] transition"
          >
            <PlusCircle size={16} />
            Expense
          </button>
        </div>
      </div>

      <ExpensesSummary
        totalExpenses={totalExpenses}
        currentMonthExpenses={currentMonthExpenses}
        count={expenses?.length || 0}
      />

      <div className="space-y-3">
        {!loading && expenses.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No expenses found
          </div>
        )}

        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            user={user!}
          />
        ))}
      </div>

      {openExpenseModal && (
        <AddExpenseModal
          open={openExpenseModal}
          onClose={() => setOpenExpenseModal(false)}
          user={user!}
        />
      )}
    </div>
  );
}
