"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Sign in successfull!");
      router.push("/admin/dashboard");
    } catch (e: any) {
      setError("Invalid credentials. Please try again.");
      toast.error(e?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 🔹 Mobile Background Image */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/images/road2.webp"
          alt="Suvidhi Villa Poster"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative flex flex-1 flex-col lg:flex-row">
        {/* 🔹 Desktop Left Image */}
        <div className="hidden lg:block relative w-1/2">
          <Image
            src="/images/road2.webp"
            alt="Suvidhi Villa Poster"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
            <h1 className="text-white text-4xl font-bold text-center">
              Welcome to <br /> Suvidhi Villa Society
            </h1>
          </div>
        </div>

        {/* 🔹 Login Section */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 py-12">
          <div className="bg-white lg:bg-white shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 border-t-4 border-[var(--color-accent)] backdrop-blur-md lg:backdrop-blur-none bg-opacity-90 lg:bg-opacity-100">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">
                Login
              </h2>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg transition text-sm sm:text-base flex items-center justify-center gap-2
    ${
      loading
        ? "bg-[var(--color-primary)] opacity-50 cursor-not-allowed"
        : "bg-[var(--color-primary)] hover:bg-[var(--color-accent)] cursor-pointer"
    }
    text-white
  `}
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Suvidhi Villa Society
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative text-center py-4 bg-white border-t text-sm">
        Made with ❤️ by <a target="_" className="text-orange-500 font-bold font-mono italic" href="https://murly.netlify.app">Murly</a>
      </footer>
    </div>
  );
}
