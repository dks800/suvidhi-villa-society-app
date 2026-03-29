import { useState } from "react";

interface typeDeleteModal {
  handleDelete: () => void;
  handleCancel: () => void;
}

export const DeleteConfirmModal = ({
  handleDelete,
  handleCancel,
}: typeDeleteModal) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!handleDelete) return;
    setLoading(true);
    await handleDelete();
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-5 shadow-xl">
        <h2 className="text-lg font-semibold text-[var(--color-darktext)]">
          Confirm Deletion
        </h2>

        <p className="text-sm text-gray-500">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border cursor-pointer hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
