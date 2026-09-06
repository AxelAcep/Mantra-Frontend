export default function BastLengkapBadge({
  lengkap,
}: {
  lengkap?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${
        lengkap
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {lengkap ? "BAST Terpenuhi" : "BAST Belum Terpenuhi"}
    </span>
  );
}
