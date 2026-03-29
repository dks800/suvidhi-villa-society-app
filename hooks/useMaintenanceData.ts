"use client";

import { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subscribeMembers } from "@/lib/services/members";
import { subscribeVillaDetails } from "@/lib/services/villas";

type RecordType = Record<string, string | number>;
export type typeSocietyDetails = {
  count: number;
  maintenance: number;
  id: string;
};

export const useMaintenanceData = (month: string) => {
  const [maintenance, setMaintenance] = useState<RecordType[]>([]);
  const [members, setMembers] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);
  const [societyDetails, setSocietyDetails] = useState<typeSocietyDetails>(
    {} as typeSocietyDetails,
  );

  /* ---------------- REALTIME MAINTENANCE ---------------- */

  useEffect(() => {
    setLoading(true);

    const q = query(
      collection(db, "maintenance"),
      where("month", "==", month),
      orderBy("villaNo", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMaintenance(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [month]);

  /* ---------------- MEMBERS + SOCIETY (STATIC) ---------------- */

  useEffect(() => {
    const unsubscribe = subscribeVillaDetails((villaDetails) => {
      setSocietyDetails(villaDetails);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeMembers((data) => {
      setMembers(data);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- DERIVED DATA ---------------- */

  const currentMonthMaintenance = useMemo(() => {
    return maintenance;
  }, [maintenance]);

  const paidVillaSet = useMemo(() => {
    return new Set(currentMonthMaintenance.map((m) => m.villaNo));
  }, [currentMonthMaintenance]);

  const unpaidMembers = useMemo(() => {
    return members.filter((m) => !paidVillaSet.has(m.villaNo));
  }, [members, paidVillaSet]);

  return {
    maintenance,
    currentMonthMaintenance,
    unpaidMembers,
    loading,
    memberList: members,
    societyDetails,
  };
};
