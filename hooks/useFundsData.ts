"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TransactionType } from "@/utils/downloadFundsLedger";

export const useFundsData = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "funds"),
      orderBy("transactionDate", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data as any);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const processFundsData = (transactions: TransactionType[]) => {
    let openingBalance = 0;
    let totalCredit = 0;
    let totalDebit = 0;

    const grouped: any = {};
    const monthlyTrend: any = {};

    transactions.forEach((t) => {
      if (t.category === "opening_balance") {
        openingBalance += t.amount;
      }

      if (t.type === "credit") totalCredit += t.amount;
      else totalDebit += t.amount;

      if (!t.month) return;

      const [year, month] = t.month.split("-");

      // GROUPING (year → month)
      if (!grouped[year]) grouped[year] = {};

      if (!grouped[year][month]) {
        grouped[year][month] = {
          total: 0,
          credit: 0,
          debit: 0,
          transactions: [],
        };
      }

      grouped[year][month].total += t.amount;
      grouped[year][month].transactions.push(t);

      if (t.type === "credit") {
        grouped[year][month].credit += t.amount;
      } else {
        grouped[year][month].debit += t.amount;
      }

      // GRAPH DATA
      const key = `${year}-${month}`;
      if (!monthlyTrend[key]) {
        monthlyTrend[key] = { credit: 0, debit: 0 };
      }

      if (t.type === "credit") {
        monthlyTrend[key].credit += t.amount;
      } else {
        monthlyTrend[key].debit += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyTrend).sort();

    const chartData = sortedMonths.map((m) => ({
      month: m,
      credit: monthlyTrend[m].credit,
      debit: monthlyTrend[m].debit,
    }));

    return {
      openingBalance,
      grouped,
      chartData,
      totalCredit,
      totalDebit,
      balance: totalCredit - totalDebit,
    };
  };

  const processedData = processFundsData(transactions);
  return {
    ...processedData,
    transactions,
    loading,
  };
};
