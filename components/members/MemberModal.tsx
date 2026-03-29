"use client";

import { useEffect, useState } from "react";
import {
  addMember,
  checkIsDuplicateVillaNo,
  updateMember,
} from "@/lib/services/members";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  editData: any;
  allVillas: string[];
}

interface Errors {
  villaNo?: string;
  name?: string;
  phone?: string;
}

export default function MemberModal({
  open,
  setOpen,
  editData,
  allVillas,
}: Props) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    villaNo: "",
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        villaNo: editData.villaNo || "",
        name: editData.name || "",
        phone: editData.phone || "",
      });
    } else {
      setForm({ villaNo: "", name: "", phone: "" });
    }

    setErrors({});
  }, [editData, open]);

  if (!open) return null;

  const validate = () => {
    const newErrors: Errors = {};

    if (!form.villaNo.trim()) {
      newErrors.villaNo = "Villa number is required";
    }

    if (allVillas.length > 0 && !allVillas.includes(form.villaNo.trim())) {
      newErrors.villaNo = `Villa number must be between: ${allVillas[0]} to ${allVillas.length + 1}`;
    }

    if (!form.name.trim()) {
      newErrors.name = "Member name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const isDuplicate = editData
        ? false
        : await checkIsDuplicateVillaNo(form.villaNo);

      if (isDuplicate) {
        toast.error(`Villa number ${form.villaNo} is already occupied`);
        setLoading(false);
        return;
      }

      if (editData?.id) {
        await updateMember(editData.id, form, String(user?.email || ""));
        toast.success("Member updated successfully");
      } else {
        await addMember(form, String(user?.email || ""));
        toast.success("Member added successfully");
      }
      setOpen(false);
      setForm({ villaNo: "", name: "", phone: "" });
      setErrors({});
    } catch (err: any) {
      toast.error(`Something went wrong. ${err?.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setForm({ villaNo: "", name: "", phone: "" });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });

    // Remove error when user starts typing
    if (errors[field as keyof Errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--color-darktext)]">
            {editData ? "Update Member" : "Add Member"}
          </h2>
          <X
            height={20}
            width={20}
            onClick={handleCancelModal}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          {/* Villa No */}
          <div>
            <input
              placeholder="Villa No"
              value={form.villaNo}
              disabled={!!editData?.villaNo}
              onChange={(e) => handleChange("villaNo", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl outline-none transition ${!!editData?.villaNo ? "bg-gray-100 cursor-not-allowed" : ""} ${
                errors.villaNo
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
              }`}
            />
            {errors.villaNo && (
              <p className="text-red-500 text-sm mt-1">{errors.villaNo}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <input
              placeholder="Member Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl outline-none transition ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              placeholder="Phone No"
              value={form.phone}
              maxLength={10}
              onChange={(e) =>
                handleChange("phone", e.target.value.replace(/\D/g, ""))
              }
              className={`w-full px-4 py-2 border rounded-xl outline-none transition ${
                errors.phone
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancelModal}
            className="px-4 py-2 rounded-xl border cursor-pointer border-gray-200 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-primary)] font-medium cursor-pointer disabled:opacity-60"
          >
            {loading ? "Saving..." : editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
