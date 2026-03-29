import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const villasRef = collection(db, "villas");

export type Villa = {
  count: number;
  maintenance: number;
};

export const subscribeVillaDetails = (
  callback: (data: Villa & { id: string }) => void,
) => {
  return onSnapshot(villasRef, (snapshot) => {
    if (snapshot.empty) return;

    const doc = snapshot.docs[0];

    callback({
      id: doc.id,
      ...(doc.data() as Villa),
    });
  });
};
