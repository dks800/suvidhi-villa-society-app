"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-[var(--color-darktext)]">Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="text-sm text-[var(--color-darktext)]">{user?.email}</div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-600 hover:underline"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
