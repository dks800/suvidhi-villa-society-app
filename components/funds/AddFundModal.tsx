"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function AddFundModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: User;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("credit");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!amount) return;

    const date = new Date();
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    try {
      setLoading(true);
      await addDoc(collection(db, "funds"), {
        type,
        amount: Number(amount),
        category,
        title: note || "Manual Entry",
        paymentMode: "cash",
        transactionDate: date,
        month,
        source: "manual",
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
      });
      toast?.success("Funds addedd successfully!");
    } catch (err: any) {
      toast?.error(err?.message || "Error in adding Funds!");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Add Funds</h2>
          <X size={24} className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Amount */}
        <input
          type="number"
          min={0}
          placeholder="Enter amount"
          className="w-full p-3 border rounded-xl"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Type */}
        <select
          className="w-full p-3 border rounded-xl"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="credit">Credit (Income)</option>
          <option value="debit">Debit (Expense)</option>
        </select>

        {/* Category */}
        <input
          type="text"
          placeholder="Category (e.g. maintenance, donation)"
          className="w-full p-3 border rounded-xl"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* Note */}
        <input
          type="text"
          placeholder="Note"
          className="w-full p-3 border rounded-xl"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 p-3 rounded-xl border border-gray-300 cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 p-3 rounded-xl bg-green-600 text-white cursor-pointer hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
