"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>

      <p className="text-gray-600 mb-6">
        You don't have permission to access this data.
        Please login again.
      </p>

      <button
        onClick={() => router.push("/login")}
        className="px-6 py-2 rounded-xl bg-[var(--color-accent)] text-white"
      >
        Go to Login
      </button>
    </div>
  );
}