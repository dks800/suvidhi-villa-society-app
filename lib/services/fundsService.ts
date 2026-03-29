import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { User } from "firebase/auth";

type RecordType = Record<string, string>;

export const addTransaction = async (data: RecordType, user: User) => {
  await addDoc(collection(db, "funds"), {
    type: data.type, // "credit" | "debit"
    amount: Number(data.amount),
    category: data.category,
    title: data.title || "", // ✅ avoid undefined
    paymentMode: data.paymentMode || "cash",
    referenceId: data.referenceId || null,
    transactionDate: data.transactionDate || new Date(),
    month: data.month,
    createdBy: user?.email,
    createdAt: serverTimestamp(),
    memberId: data?.memberId || null,
    memberName: data?.memberName || null,
    villaNo: data?.villaNo || null,
  });
};

export const updateTransaction = async (id: string, data: RecordType) => {
  const ref = doc(db, "funds", id);

  await updateDoc(ref, {
    ...data,
    amount: Number(data.amount),
  });
};

export const deleteTransaction = async (id: string) => {
  await deleteDoc(doc(db, "funds", id));
};

export const getTransactionsByReference = async (referenceId: string) => {
  const q = query(
    collection(db, "funds"),
    where("referenceId", "==", referenceId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const deleteTransactionByReference = async (referenceId: string) => {
  const transactions = await getTransactionsByReference(referenceId);

  const promises = transactions.map((t: RecordType) =>
    deleteDoc(doc(db, "funds", t.id)),
  );

  await Promise.all(promises);
};

export const updateTransactionByReference = async (
  referenceId: string,
  newAmount: number,
) => {
  const transactions = await getTransactionsByReference(referenceId);

  const promises = transactions.map((t: RecordType) =>
    updateDoc(doc(db, "funds", t.id), {
      amount: Number(newAmount),
    }),
  );

  await Promise.all(promises);
};
