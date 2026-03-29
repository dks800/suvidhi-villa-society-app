import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  addTransaction,
  deleteTransactionByReference,
  updateTransactionByReference,
} from "./fundsService";
import { User } from "firebase/auth";

const maintenanceRef = collection(db, "maintenance");

type FormType = Record<string, string>;

export const addMaintenance = async (form: FormType, user: User) => {
  const total =
    Number(form.amount || 0) +
    Number(form.prevDue || 0) +
    Number(form.lateFees || 0);

  const payload = {
    memberId: form.memberId,
    memberName: form.memberName,
    villaNo: form.villaNo,
    month: form.month,
    amount: Number(form.amount),
    prevDue: Number(form.prevDue || 0),
    lateFees: Number(form.lateFees || 0),
    total,
    paymentMode: form?.paymentMode?.toUpperCase(),
    receivedBy: form.receivedBy,
    createdBy: user?.email,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(maintenanceRef, payload);
  await addTransaction(
    {
      type: "credit",
      amount: String(total),
      category: "maintenance",
      title: `Maintenance - ${form.memberName}`,
      referenceId: docRef.id,
      month: form.month,
      memberId: form.memberId,
      memberName: form.memberName,
      villaNo: form.villaNo,
    },
    user,
  );
};

export const checkMaintenanceExists = async (
  memberId: string,
  month: string,
) => {
  const q = query(
    maintenanceRef,
    where("memberId", "==", memberId),
    where("month", "==", month),
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const getMaintenanceList = async (month: string) => {
  const q = query(
    maintenanceRef,
    where("month", "==", month),
    orderBy("villaNo", "asc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateMaintenance = async (id: string, form: FormType) => {
  const total =
    Number(form.amount || 0) +
    Number(form.prevDue || 0) +
    Number(form.lateFees || 0);

  await updateDoc(doc(db, "maintenance", id), {
    ...form,
    total,
  });
  await updateTransactionByReference(id, total);
};

export const deleteMaintenance = async (id: string) => {
  const docRef = doc(db, "maintenance", id);
  await deleteDoc(docRef);
  await deleteTransactionByReference(id);
};
