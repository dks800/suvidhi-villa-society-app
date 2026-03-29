"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { sortMembers } from "@/lib/services/members";

export type ReportType = "members" | "maintenance" | "expenses" | "funds";

interface Props {
  type: ReportType;
  fromDate: string;
  toDate: string;
}

export const useReportsData = ({ type, fromDate, toDate }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: any;

    setLoading(true);

    // 🔹 MEMBERS REPORT
    if (type === "members") {
      unsubscribe = onSnapshot(collection(db, "members"), (snap) => {
        const members = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData({
          totalMembers: members.length,
          members: sortMembers(members, "villaNo"),
        });

        setLoading(false);
      });
    }

    // 🔹 MAINTENANCE REPORT
    if (type === "maintenance") {
      if (!fromDate || !toDate) {
        setLoading(false);
        return;
      }
      const from = Timestamp.fromDate(new Date(fromDate));
      const to = Timestamp.fromDate(
        new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      );

      let membersList: any[] = [];
      let maintenanceRecords: any[] = [];

      const unsubMembers = onSnapshot(collection(db, "members"), (snap) => {
        membersList = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        processData();
      });

      const unsubMaintenance = onSnapshot(
        query(
          collection(db, "maintenance"),
          where("createdAt", ">=", from),
          where("createdAt", "<=", to),
        ),
        (snap) => {
          maintenanceRecords = snap.docs.map((doc) => doc.data());
          processData();
        },
      );

      const processData = () => {
        if (!membersList.length) return;

        // 🔹 Map maintenance by memberId
        const recordMap = new Map();

        maintenanceRecords.forEach((r) => {
          recordMap.set(r.memberId, r);
        });

        // 🔹 Merge
        const merged = sortMembers(membersList).map((m) => {
          const record = recordMap.get(m.id);

          if (record) {
            return {
              ...m,
              ...record,
              status: "paid",
            };
          }

          return {
            ...m,
            amount: 0,
            paymentMode: "-",
            status: "unpaid",
          };
        });

        // 🔹 Summary
        const paid = merged.filter((m) => m.status === "paid");
        const unpaid = merged.filter((m) => m.status === "unpaid");

        const totalCollection = paid.reduce(
          (sum, m) => sum + Number(m.amount || 0),
          0,
        );

        setData({
          total: merged.length,
          paid: paid.length,
          unpaid: unpaid.length,
          totalCollection,
          records: merged,
        });

        setLoading(false);
      };

      return () => {
        unsubMembers();
        unsubMaintenance();
      };
    }

    // 🔹 EXPENSES REPORT
    if (type === "expenses") {
      const q = query(
        collection(db, "expenses"),
        where("createdAt", ">=", fromDate),
        where("createdAt", "<=", toDate),
      );

      unsubscribe = onSnapshot(q, (snap) => {
        const expenses = snap.docs.map((doc) => doc.data());

        let total = 0;
        let paid = 0;

        expenses.forEach((exp: any) => {
          total += exp.totalAmount || 0;
          paid += exp.paidAmount || 0;
        });

        setData({
          totalExpenses: total,
          totalPaid: paid,
          pending: total - paid,
          expenses,
        });

        setLoading(false);
      });
    }

    // 🔹 FUNDS REPORT (LEDGER)
    if (type === "funds") {
      const q = query(
        collection(db, "funds"),
        where("createdAt", ">=", fromDate),
        where("createdAt", "<=", toDate),
      );

      unsubscribe = onSnapshot(q, (snap) => {
        const entries = snap.docs.map((doc) => doc.data());

        let credit = 0;
        let debit = 0;

        entries.forEach((e: any) => {
          if (e.type === "credit") credit += e.amount;
          else debit += e.amount;
        });

        setData({
          totalCredit: credit,
          totalDebit: debit,
          closingBalance: credit - debit,
          entries,
        });

        setLoading(false);
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [type, fromDate, toDate]);

  return { data, loading };
};
