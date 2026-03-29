import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

export type Member = Record<string, string>;

const membersRef = collection(db, "members");

export const subscribeMembers = (callback: (data: Member[]) => void) => {
  return onSnapshot(membersRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Member, "id">),
    }));

    callback(sortMembers(data, "villaNo"));
  });
};

export const getMembers = async () => {
  const snapshot = await getDocs(membersRef);

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Member, "id">),
  }));

  return sortMembers(data, "villaNo");
};

export const addMember = async (
  data: Record<string, string>,
  userEmail: string,
) => {
  return await addDoc(membersRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
  });
};

export const updateMember = async (
  id: string,
  data: Partial<Member>,
  userEmail: string,
) => {
  const docRef = doc(db, "members", id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
  });
};

export const deleteMember = async (id: string) => {
  const docRef = doc(db, "members", id);
  return await deleteDoc(docRef);
};

export const checkIsDuplicateVillaNo = async (villaNo: string) => {
  const q = query(membersRef, where("villaNo", "==", villaNo?.trim()));

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const sortMembers = (members: Member[], sortBy = "villaNo") => {
  return [...members].sort((a, b) => {
    if (sortBy === "villaNo") {
      const parseVilla = (val: string) => {
        if (!val) return [0, 0];
        const parts = val.split("/").map(Number);
        return [parts[0] || 0, parts[1] || 0];
      };

      const [aMain, aSub] = parseVilla(a.villaNo);
      const [bMain, bSub] = parseVilla(b.villaNo);

      if (aMain !== bMain) return aMain - bMain;
      return aSub - bSub;
    }

    return (a[sortBy] || "").localeCompare(b[sortBy] || "");
  });
};
