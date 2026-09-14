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

  const isComplete = selesai === total;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${
        isComplete
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {selesai ?? 0} Dari {total}
    </span>
  );
}
