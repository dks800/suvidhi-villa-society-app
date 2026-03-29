"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteMemberModal } from "./DeleteMemberModal";

interface Props {
  members: Record<string, string | number>[];
  onEdit: (data: Record<string, string | number>) => void;
}

export default function MemberCards({ members, onEdit }: Props) {
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  return (
    <>
      {/* Cards Grid */}
      {members.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-400">
          No members found
        </div>
      ) : (
        <div
          className="grid gap-4 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-3 
                        lg:grid-cols-8"
        >
          {members.map((member) => (
            <div
              key={member.id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group hover:bg-[var(--color-accent)] cursor-pointer"
            >
              {/* Background Villa No */}
              <div className="absolute inset-0 flex items-flex-start justify-center pointer-events-none pt-2">
                <h1 className="text-5xl font-bold text-gray-100 group-hover:text-[var(--color-darktext)] transition">
                  {member.villaNo}
                </h1>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-30">
                {/* Member Name */}
                <div className="mt-15 flex flex-col items-center text-center">
                  <h3 className="text-sm font-semibold text-[var(--color-darktext)]">
                    {member.name}
                  </h3>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => onEdit(member)}
                    className="flex items-center justify-center cursor-pointer gap-1 w-full px-3 py-1.5 text-xs bg-blue-50 group-hover:bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(member.id)}
                    className="flex items-center justify-center cursor-pointer gap-1 w-full px-3 py-1.5 text-xs bg-red-50 group-hover:bg-red-100 hover:bg-red-200 text-red-600 transition"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <DeleteMemberModal
          deleteId={String(deleteId)}
          handleCancel={() => setDeleteId(null)}
        />
      )}
    </>
  );
}
