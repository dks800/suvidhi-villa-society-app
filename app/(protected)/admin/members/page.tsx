"use client";

import { useEffect, useState, useMemo } from "react";
import MemberTable from "@/components/members/MemberTable";
import MemberModal from "@/components/members/MemberModal";
import { Member, subscribeMembers } from "@/lib/services/members";
import { subscribeVillaDetails } from "@/lib/services/villas";
import { DeleteMemberModal } from "@/components/members/DeleteMemberModal";
import { ArrowDown } from "lucide-react";
import { Loader } from "@/components/Loader";

export default function MembersPage() {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("villaNo");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [totalVillas, setTotalVillas] = useState(54);

  useEffect(() => {
    setLoading(true);

    let membersLoaded = false;
    let villasLoaded = false;

    const checkLoadingDone = () => {
      if (membersLoaded || villasLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeMembers = subscribeMembers((data) => {
      setMembers(data);
      membersLoaded = true;
      checkLoadingDone();
    });

    const unsubscribeVillas = subscribeVillaDetails((villasData) => {
      setTotalVillas(villasData?.count);
      villasLoaded = true;
      checkLoadingDone();
    });

    return () => {
      unsubscribeMembers();
      unsubscribeVillas();
    };
  }, []);

  const filtered = useMemo(() => {
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.villaNo?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const excluded = ["10", "11"];

  const allVillas = Array.from({ length: totalVillas }, (_, i) =>
    String(i + 1),
  ).filter((villa) => !excluded.includes(villa));
  const emptyVillas = useMemo(() => {
    const occupied = members.map((m) => String(m.villaNo));

    return allVillas.filter((villa) => !occupied.includes(villa));
  }, [members, allVillas]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-[var(--color-darktext)]">
          Members ({totalVillas})
        </h1>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-[var(--color-accent)] font-medium transition cursor-pointer hover:bg-[var(--color-primary-hover)]"
        >
          + Add Member
        </button>
      </div>

      {/* ================= SEARCH & SORT ================= */}
      <div className="flex gap-4">
        <input
          placeholder="Search by name or villa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-indigo-200 transition"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-indigo-200 transition"
        >
          <option value="villaNo">Sort by Villa</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>
      {loading && filtered?.length < 1 && (
        <div className="flex gap-2 items-center justify-center">
          <Loader />
        </div>
      )}
      {/* ================================================= */}
      {/* ================= DESKTOP VIEW ================== */}
      {/* ================================================= */}
      <div className="hidden md:block space-y-6">
        {!loading && filtered?.length > 0 && (
          <>
            <p className="text-sm font-semibold text-[var(--color-darktext)]">
              Residents ({filtered.length})
            </p>
            <MemberTable
              members={filtered}
              onEdit={(data: Record<string, unknown>) => {
                setEditData(data);
                setOpen(true);
              }}
            />
          </>
        )}

        {emptyVillas.length > 0 && (
          <>
            <p className="text-sm font-semibold text-[var(--color-darktext)]">
              Empty Villas ({emptyVillas.length})
            </p>

            <div className="flex flex-wrap gap-3">
              {emptyVillas.map((villaNo) => (
                <div
                  key={villaNo}
                  className="w-[90px] bg-gray-50 rounded-xl border border-dashed border-gray-300 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="text-center py-2 text-sm font-semibold text-gray-400">
                    {villaNo}
                  </div>

                  <button
                    onClick={() => {
                      setEditData({
                        villaNo,
                        name: "",
                        phone: "",
                      });
                      setOpen(true);
                    }}
                    className="text-xs py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-b-xl transition cursor-pointer hover:bg-green-200"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ================================================= */}
      {/* ================= MOBILE VIEW =================== */}
      {/* ================================================= */}
      <div className="md:hidden space-y-4">
        {/* -------- Residents Accordion -------- */}
        <div className="bg-white rounded-xl shadow-sm">
          <details open className="group">
            <summary className="cursor-pointer list-none p-4 font-semibold text-[var(--color-darktext)]">
              Residents ({filtered.length}){" "}
              <ArrowDown
                size={16}
                className="inline-block ml-1 transition-transform group-open:rotate-180"
              />
            </summary>

            <div className="border-t">
              {!loading && filtered.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">No residents found</p>
              ) : (
                filtered.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-4 py-3 border-b last:border-none"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="font-semibold text-sm w-10">
                        {member.villaNo}
                      </span>
                      <span className="text-sm text-gray-600">
                        {member.name}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditData(member);
                          setOpen(true);
                        }}
                        className="p-1.5 rounded-md bg-blue-50 text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(member.id)}
                        className="p-1.5 rounded-md bg-red-50 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </details>
        </div>

        {/* -------- Empty Villas Accordion -------- */}
        <div className="bg-white rounded-xl shadow-sm">
          <details className="group">
            <summary className="cursor-pointer list-none p-4 font-semibold text-[var(--color-darktext)]">
              Empty Villas ({emptyVillas.length}){" "}
              <ArrowDown
                size={16}
                className="inline-block ml-1 transition-transform group-open:rotate-180"
              />
            </summary>

            <div className="border-t p-3">
              <div className="flex flex-wrap gap-1">
                {emptyVillas.map((villaNo) => (
                  <div
                    key={villaNo}
                    className="w-[18%] min-w-[60px] bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col"
                  >
                    <div className="text-center text-xs py-1 text-gray-400 font-semibold">
                      {villaNo}
                    </div>

                    <button
                      onClick={() => {
                        setEditData({
                          villaNo,
                          name: "",
                          phone: "",
                        });
                        setOpen(true);
                      }}
                      className="text-[10px] py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-b-lg"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>

      {deleteId && (
        <DeleteMemberModal
          deleteId={deleteId}
          handleCancel={() => setDeleteId(null)}
        />
      )}

      {/* ================= MODAL ================= */}
      {open && (
        <MemberModal
          allVillas={[...allVillas, "10/11"]}
          open={open}
          setOpen={setOpen}
          editData={editData}
        />
      )}
    </div>
  );
}
