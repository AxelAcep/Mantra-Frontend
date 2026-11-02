export function sortDokumenByCreatedAtAsc<
  T extends { createdAt?: string | null },
>(dokumen: T[]): T[] {
  return [...dokumen].sort(
    (a, b) =>
      new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime(),
  );
}
