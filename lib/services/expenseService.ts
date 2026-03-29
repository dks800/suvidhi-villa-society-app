import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { User } from "firebase/auth";

/* ---------------- HELPERS ---------------- */

const getMonthFromDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

/* ---------------- CREATE EXPENSE ---------------- */

export const createExpense = async ({ title, notes, payment, user }: any) => {
  const date = new Date(payment.paymentDate);
  const expenseMonth = getMonthFromDate(date);
  const year = date.getFullYear();

  const expenseRef = await addDoc(collection(db, "expenses"), {
    title,
    notes: notes || "",
    totalAmount: payment.amount,
    paymentCount: 1,
    expenseMonth,
    year,
    createdAt: serverTimestamp(),
    createdBy: user?.email,
  });

  // 🔥 IMPORTANT: Always use addPayment
  await addPayment(expenseRef.id, payment, user);

  return expenseRef.id;
};

/* ---------------- UPDATE TOTALS ---------------- */

export const updateExpenseTotals = async (expenseId: string) => {
  const paymentsRef = collection(db, "expenses", expenseId, "payments");
  const snapshot = await getDocs(paymentsRef);

  let total = 0;

  snapshot.forEach((doc) => {
    total += Number(doc.data().amount || 0);
  });

  await updateDoc(doc(db, "expenses", expenseId), {
    totalAmount: total,
    paymentCount: snapshot.size,
    lastUpdatedAt: serverTimestamp(),
  });
};

/* ---------------- ADD PAYMENT ---------------- */

export const addPayment = async (expenseId: string, payment: any, user: User) => {
  if (!user) return console.error("❌ User not found");

  const date = payment.paymentDate || new Date();
  const month = getMonthFromDate(date);

  // 1. Add payment
  const paymentRef = await addDoc(
    collection(db, "expenses", expenseId, "payments"),
    {
      ...payment,
      amount: Number(payment.amount),
      paymentDate: date,
      createdAt: serverTimestamp(),
      createdBy: user.email,
    }
  );

  // 2. Add funds entry
  await addDoc(collection(db, "funds"), {
    type: "debit",
    amount: Number(payment.amount),
    category: "expense",
    title: payment.note || "Expense Payment",
    referenceId: expenseId,
    paymentId: paymentRef.id,
    paymentMode: payment.paymentMode || "cash",
    transactionDate: date,
    month,
    createdAt: serverTimestamp(),
    createdBy: user.email,
  });

  await updateExpenseTotals(expenseId);
};

/* ---------------- UPDATE PAYMENT ---------------- */

export const updatePayment = async (
  expenseId: string,
  paymentId: string,
  data: any,
  user: any
) => {
  if (!user) return console.error("❌ User not authenticated");

  const paymentRef = doc(db, "expenses", expenseId, "payments", paymentId);

  await updateDoc(paymentRef, {
    ...data,
    amount: Number(data.amount),
    paymentDate: data.paymentDate,
    updatedAt: serverTimestamp(),
    updatedBy: user.email,
  });

  const date = data.paymentDate || new Date();
  const month = getMonthFromDate(date);

  const q = query(
    collection(db, "funds"),
    where("paymentId", "==", paymentId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.warn("⚠️ Missing funds entry → creating new one");

    await addDoc(collection(db, "funds"), {
      type: "debit",
      amount: Number(data.amount),
      category: "expense",
      referenceId: expenseId,
      paymentId,
      transactionDate: date,
      month,
      createdAt: serverTimestamp(),
      createdBy: user.email,
    });
  } else {
    for (const docItem of snapshot.docs) {
      await updateDoc(doc(db, "funds", docItem.id), {
        amount: Number(data.amount),
        transactionDate: date,
        month,
        paymentMode: data.paymentMode || "cash",
        title: data.note || "Expense Payment",
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
    }
  }

  await updateExpenseTotals(expenseId);
};

/* ---------------- DELETE PAYMENT ---------------- */

export const deleteExpensePayment = async (
  expenseId: string,
  paymentId: string
) => {
  // 1. Delete payment
  await deleteDoc(doc(db, "expenses", expenseId, "payments", paymentId));

  // 2. Delete linked funds entry
  const q = query(
    collection(db, "funds"),
    where("paymentId", "==", paymentId)
  );

  const snapshot = await getDocs(q);

  for (const docItem of snapshot.docs) {
    await deleteDoc(doc(db, "funds", docItem.id));
  }

  await updateExpenseTotals(expenseId);
};

/* ---------------- DELETE EXPENSE ---------------- */

export const deleteExpense = async (expenseId: string) => {
  // 🔥 Delete all payments + funds
  const paymentsRef = collection(db, "expenses", expenseId, "payments");
  const snapshot = await getDocs(paymentsRef);

  for (const payment of snapshot.docs) {
    await deleteExpensePayment(expenseId, payment.id);
  }

  // Delete expense
  await deleteDoc(doc(db, "expenses", expenseId));
};

/* ---------------- SUBSCRIBE PAYMENTS ---------------- */

export const subscribeExpensePayments = (
  expenseId: string,
  callback: (payments: any[]) => void
) => {
  const paymentsRef = collection(db, "expenses", expenseId, "payments");

  const q = query(paymentsRef, orderBy("paymentDate", "desc"));

  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(payments);
  });
};