"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  MessageSquare,
  X,
  LogOut,
  FormIcon,
  DownloadIcon,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Maintenance", href: "/admin/maintenance", icon: FormIcon },
  { name: "Expenses", href: "/admin/expenses", icon: Receipt },
  { name: "Funds", href: "/admin/funds", icon: Wallet },
  { name: "Reports", href: "/admin/reports", icon: DownloadIcon },
  { name: "Complaints", href: "/admin/complaints", icon: MessageSquare },
];

export default function Sidebar({ open, setOpen }: Props) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-72
          bg-[var(--color-primary)] text-white
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex md:flex-col
        `}
      >
        {/* Mobile Close */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10 flex flex-col items-center gap-1">
          <Image
            src="/images/logo.png"
            loading="eager"
            alt="Suvidhi Villa Logo"
            width={120}
            height={60}
          />
          <p className="text-xs text-white/60">Society Management App</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold shadow-lg"
                      : "hover:bg-white/10 text-white/80 hover:text-white"
                  }`}
              >
                <Icon
                  size={18}
                  className={`transition ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "group-hover:text-[var(--color-accent)]"
                  }`}
                />
                <span className="text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Premium Logout Footer */}
        <div className="mt-auto p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="
      group relative w-full flex items-center gap-3
      px-5 py-3 rounded-2xl
      bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold
      shadow-lg shadow-black/30
      hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]
      transition-all duration-300
      overflow-hidden cursor-pointer
    "
          >
            {/* Animated Shine Layer */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/10 blur-xl" />

            <LogOut
              size={18}
              className="text-red-800 transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="text-sm font-semibold tracking-wide text-red-800">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
