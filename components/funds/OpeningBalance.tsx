"use client";

import { addTransaction } from "@/lib/services/fundsService";
import { User } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OpeningBalance({ user }: { user: User }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) return toast.error("Enter amount");

    try {
      setLoading(true);

      const today = new Date();
      const month = `${today.getFullYear()}-${String(
        today.getMonth() + 1,
      ).padStart(2, "0")}`;

      await addTransaction(
        {
          type: "credit",
          amount: amount,
          category: "opening_balance",
          title: "Opening Balance",
          paymentMode: "cash",
          transactionDate: today.toDateString(),
          month,
        },
        user,
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to set opening balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Set Opening Balance
        </h2>

        <input
          type="number"
          min={0}
          placeholder="Enter amount"
          className="w-full border rounded-xl p-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl cursor-pointer"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
