"use client";

interface Props {
  data: { members: Record<string, string>[] };
}

export default function MembersReportPreview({ data }: Props) {
  if (!data || !data.members?.length) {
    return <p className="text-center text-gray-500">No members found</p>;
  }

  return (
    <div>
      <div className="p-4 border-b flex justify-between items-center">
        <p className="font-semibold">Members List</p>
        <p className="text-sm text-gray-500">Total: {data.members.length}</p>
      </div>
      <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 px-4 py-2 bg-gray-50">
        <p>Villa No</p>
        <p>Name</p>
        <p className="text-right">Phone</p>
      </div>
      <div>
        {data.members.map((m: Record<string, string>) => (
          <div
            key={m.id}
            className="grid grid-cols-3 px-4 py-3 border-b text-sm items-center"
          >
            <p className="font-semibold text-[var(--color-primary)]">{m.villaNo || "-"}</p>
            <p className="truncate">{m.name}</p>
            <a className="text-right text-gray-600" href={`tel:${m.phone}`}>
              {m.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
