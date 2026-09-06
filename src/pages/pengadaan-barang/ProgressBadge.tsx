export default function ProgressBadge({
  selesai,
  total,
}: {
  selesai?: number;
  total?: number;
}) {
  if (!total) {
    return <span className="text-gray-300">—</span>;
  }

  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
      {selesai ?? 0} DARI {total}
    </span>
  );
}
