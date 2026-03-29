import { formatCurrency } from "@/utils/common";

type Props = {
  totalExpenses: number;
  currentMonthExpenses: number;
  count: number
};

export const ExpensesSummary = ({
  totalExpenses,
  count
}: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-xl font-semibold">
          {formatCurrency(totalExpenses, true)}
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Count</p>
        <p className="text-xl font-semibold">
          {count}
        </p>
      </div>

    </div>
  );
};