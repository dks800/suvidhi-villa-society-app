import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type ExpenseType = Record<string, string | number>;

export const useExpensesData = (selectedMonth: string) => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);

  useEffect(() => {
    setLoading(true);
    const expensesRef = collection(db, "expenses");
    let q = query(expensesRef, orderBy("createdAt", "desc"));

    if (selectedMonth) {
      q = query(
        expensesRef,
        where("expenseMonth", "==", selectedMonth),
        orderBy("createdAt", "desc"),
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ExpenseType[] = [];

      let total = 0;
      let monthlyTotal = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();

        const expense = {
          id: doc.id,
          ...data,
        } as ExpenseType;

        list.push(expense);

        const amount = Number(data.totalAmount || 0);

        total += amount;

        if (data.expenseMonth === selectedMonth) {
          monthlyTotal += amount;
        }
      });

      setExpenses(list);
      setTotalExpenses(total);
      setCurrentMonthExpenses(monthlyTotal);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedMonth]);

  return {
    expenses,
    totalExpenses,
    currentMonthExpenses,
    loading,
  };
};
