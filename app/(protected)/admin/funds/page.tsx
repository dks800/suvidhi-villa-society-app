"use client";

import { Loader } from "@/components/Loader";
import { useFundsData } from "@/hooks/useFundsData";
import { useAuth } from "@/lib/AuthContext";
import { formatCurrency } from "@/utils/common";
import { ReactNode, useEffect, useState } from "react";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  DownloadIcon,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddFundModal from "@/components/funds/AddFundModal";
import DownloadFundsModal from "@/components/funds/DownloadFundsModal";
import { Timestamp } from "firebase/firestore";

type FundTransaction = {
  transactionDate: Timestamp | string;
};

export const formatDate = (date: Timestamp | string) => {
  if (!date) return "";

  if (typeof date === "string") {
    return new Date(date).toLocaleDateString();
  }
  return date.toDate().toLocaleDateString();
};

export default function FundsPage() {
  const [openYear, setOpenYear] = useState<string | null>(null);
  const [openMonth, setOpenMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [openFundModal, setOpenFundModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const {
    grouped,
    transactions,
    chartData,
    openingBalance,
    balance,
    totalCredit,
    totalDebit,
    loading,
  } = useFundsData();

  const { user } = useAuth();

  // 👉 Default expand current year/month
  useEffect(() => {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");

    setOpenYear(year);
    setOpenMonth(month);
  }, []);

  if (loading) return <Loader />;

  // 👉 Month name formatter
  const formatMonth = (year: string, month: string) => {
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString("default", { month: "long" });
  };

  const BalanceDisplay = ({ credit = 0, debit = 0, monthBalance = 0 }) => {
    const showOnlyDebit = credit < 1 && debit > 1;
    const showOnlyCredit = credit > 1 && debit < 1;
    const showBoth = credit > 1 && debit > 1;

    return (
      <div className="flex items-center gap-1 text-sm">
        {showOnlyDebit && (
          <span className="text-red-600 font-bold">
            {formatCurrency(debit)}
          </span>
        )}

        {showOnlyCredit && (
          <span className="text-green-600 font-bold">
            {formatCurrency(credit)}
          </span>
        )}

        {showBoth && (
          <>
            <span className="text-gray-800 font-bold">
              {formatCurrency(monthBalance)}
            </span>
            <span className="text-green-600">({formatCurrency(credit)}</span>
            <span className="text-red-600">- {formatCurrency(debit)})</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 💰 TOTAL BALANCE */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white text-center shadow">
        <p className="text-sm opacity-80">Total Balance</p>
        <h1 className="text-3xl font-bold">{formatCurrency(balance, true)}</h1>
      </div>

      {/* 💳 CREDIT / DEBIT */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-xs text-gray-500">Total Credit</p>
          <h2 className="text-lg font-semibold text-green-600">
            + {formatCurrency(totalCredit, true)}
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs text-gray-500">Total Debit</p>
          <h2 className="text-lg font-semibold text-red-600">
            - {formatCurrency(totalDebit, true)}
          </h2>
        </div>
      </div>

      {/* 📊 BAR CHART */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-sm mb-3 font-medium">Monthly Overview</h3>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              tickFormatter={(m) => {
                const [y, mo] = m.split("-");
                return formatMonth(y, mo);
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: unknown) => formatCurrency(value as number)}
              labelFormatter={(label: ReactNode) => {
                if (typeof label !== "string") return "";

                const [y, mo] = label.split("-");
                return `${formatMonth(y, mo)} ${y}`;
              }}
            />
            <Bar dataKey="credit" />
            <Bar dataKey="debit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔽 YEAR FILTER */}
      <div className="flex gap-2 justify between">
        <select
          className="w-full p-3 border rounded-xl border-gray-200 bg-white pr-4"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="all">All Years</option>
          {Object.keys(grouped).map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
        <button
          onClick={() => setShowDownloadModal(true)}
          disabled={Object.keys(grouped)?.length < 1}
          className={`cursor-pointer bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-dark)] px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-[var(--color-accent-hover) ${Object.keys(grouped)?.length < 1 ? "bg-[var(--color-accent)] opacity-50 cursor-not-allowed" : ""}`}
        >
          <DownloadIcon size={16} /> List
        </button>
      </div>

      {/* 📅 YEAR ACCORDION */}
      {Object.keys(grouped)
        .filter((y) => selectedYear === "all" || y === selectedYear)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const yearCredit = Object.values(grouped[year]).reduce(
            (acc: number, m: any) => acc + m.credit,
            0,
          );

          const yearDebit = Object.values(grouped[year]).reduce(
            (acc: number, m: any) => acc + m.debit,
            0,
          );

          const yearBalance = yearCredit - yearDebit;

          return (
            <div
              key={year}
              className="bg-white border rounded-2xl shadow-sm overflow-hidden border-gray-200"
            >
              {/* YEAR HEADER */}
              <div
                onClick={() => setOpenYear(openYear === year ? null : year)}
                className="flex items-center justify-between p-4 cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-sm sm:text-base flex gap-2 items-center">
                    <CalendarClock /> {year}
                    <span className="text-xs text-gray-500">
                      ({Object.keys(grouped[year]).length} months)
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <BalanceDisplay
                    credit={yearCredit}
                    debit={yearDebit}
                    monthBalance={yearBalance}
                  />
                  {openYear === year ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>

              {/* MONTHS */}
              {openYear === year && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {Object.keys(grouped[year])
                    .sort((a, b) => Number(b) - Number(a))
                    .map((month) => {
                      const data = grouped[year][month];
                      const monthCredit = data.transactions.reduce(
                        (acc: number, t: any) =>
                          acc + (t.type === "credit" ? Number(t.amount) : 0),
                        0,
                      );

                      const monthDebit = data.transactions.reduce(
                        (acc: number, t: any) =>
                          acc + (t.type === "debit" ? Number(t.amount) : 0),
                        0,
                      );

                      const monthBalance = monthCredit - monthDebit;
                      return (
                        <div key={month} className="border-b border-gray-100">
                          <div
                            onClick={() =>
                              setOpenMonth(
                                openMonth === `${year}-${month}`
                                  ? null
                                  : `${year}-${month}`,
                              )
                            }
                            className="flex justify-between items-center p-4 cursor-pointer px-8"
                          >
                            <div>
                              <p className="font-medium text-sm flex gap-2 items-center">
                                {formatMonth(year, month)}
                                <span className="text-xs text-gray-500">
                                  ({data.transactions.length} transactions)
                                </span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <BalanceDisplay
                                credit={data.credit}
                                debit={data.debit}
                                monthBalance={monthBalance}
                              />
                              {openMonth === `${year}-${month}` ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </div>
                          </div>

                          {openMonth === `${year}-${month}` && (
                            <div className="px-4 pb-4 space-y-2 px-8">
                              {data.transactions.map(
                                (t: Record<string, string>) => {
                                  return (
                                    <div
                                      key={t.id}
                                      className="flex justify-between items-center p-3 bg-white rounded-xl border  border-gray-100"
                                    >
                                      <div>
                                        <p className="text-sm font-medium">
                                          {t.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {t?.paymentMode?.toUpperCase()} •{" "}
                                          {t?.type?.toUpperCase()} •{" "}
                                          {formatDate(t.transactionDate)}
                                        </p>
                                      </div>

                                      <div className="text-right">
                                        <p
                                          className={`text-sm font-semibold ${
                                            t.type === "credit"
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {t.type === "credit" ? "+" : "-"}{" "}
                                          {formatCurrency(t.amount)}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      {openFundModal && (
        <AddFundModal
          open={openFundModal}
          onClose={() => setOpenFundModal(false)}
          user={user!}
        />
      )}
      {showDownloadModal && (
        <DownloadFundsModal
          year={selectedYear}
          transactions={transactions}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
      <button
        onClick={() => setOpenFundModal(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:bg-green-600 transition`}
      >
        <Plus />
      </button>
    </div>
  );
}
