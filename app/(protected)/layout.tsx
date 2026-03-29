"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Loader } from "@/components/Loader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-[var(--color-primary)]">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-lightbg)] flex">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 bg-[var(--color-primary)] text-white shadow">
          <div className="flex items-center gap-2 w-full cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="Suvidhi Villa Logo"
              loading="eager"
              width={60}
              height={30}
              onClick={() => router.push("/admin/dashboard")}
            />
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--color-darktext)]">
            Dashboard
          </h2>

          <p className="text-sm text-gray-500">Welcome, {user.email}</p>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
