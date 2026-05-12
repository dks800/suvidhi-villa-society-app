"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Wrench,
  Receipt,
  Wallet,
  FileText,
  MessageSquare,
} from "lucide-react";

const modules = [
  {
    title: "Members",
    description: "Manage all society members",
    icon: Users,
    color: "green",
    navigate: "/admin/members",
  },
  {
    title: "Maintenance",
    description: "Track maintenance payments",
    icon: Wrench,
    color: "orange",
    navigate: "/admin/maintenance",
  },
  {
    title: "Expenses",
    description: "Manage all expenses",
    icon: Receipt,
    color: "red",
    navigate: "/admin/expenses",
  },
  {
    title: "Funds",
    description: "View financial ledger",
    icon: Wallet,
    color: "purple",
    navigate: "/admin/funds",
  },
  {
    title: "Reports",
    description: "Generate reports & PDFs",
    icon: FileText,
    color: "yellow",
    navigate: "/admin/reports",
  },
  {
    title: "Complaints",
    description: "Handle society issues",
    icon: MessageSquare,
    color: "teal",
    navigate: "/admin/complaints",
  },
];

const getColorClasses = (color: string) => {
  const map: any = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    teal: "bg-teal-100 text-teal-600",
  };

  return map[color] || map.blue;
};

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            🏡 Suvidhi Villa Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Manage your society operations efficiently.
          </p>
        </div>

        {/* 🔹 Modules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const colorClass = getColorClasses(module.color);

            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                whileHover={{ scale: 1.04 }}
                className="cursor-pointer"
                onClick={() => router.push(module.navigate)}
              >
                <div className="rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-200 bg-white flex items-center justify-center">
                  <div className="p-5 md:p-6 flex flex-col items-center gap-4 text-center">
                    {/* Icon */}
                    <div className={`p-3 rounded-2xl ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Text */}
                    <div>
                      <h2 className="text-sm md:text-lg font-semibold">
                        {module.title}
                      </h2>

                      <p className="hidden sm:block text-xs md:text-sm text-gray-500 mt-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}