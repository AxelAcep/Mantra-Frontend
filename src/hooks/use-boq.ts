/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPreloadBoQ,
  uploadDokumenBoQ,
  deleteDokumenBoQ,
  updateSubTotalBoQ,
  updateStatusBoQ,
} from "@/services/boq.service"; // sesuaikan path file service kamu

export function usePreloadBoQ(trackingId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["boq-detail", trackingId],
    queryFn: () => getPreloadBoQ(trackingId!),
    enabled: !!trackingId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as any).message : null,
    refetch,
  };
}
export function useUploadDokumenBoQ(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    // Nerima objek { file } dari komponen UI
    mutationFn: ({ file }: { file: File }) =>
      uploadDokumenBoQ(trackingId, file),
    onSuccess: () => {
      // WAJIB PASTIIN: key ini harus kembar dengan yang dipakai di usePreloadBoQ
      qc.invalidateQueries({ queryKey: ["boq-detail", trackingId] });
    },
  });
}

export function useDeleteDokumenBoQ(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    // Diubah menerima string langsung biar pas manggil tinggal: deleteMut.mutate(id)
    mutationFn: (dokumenId: string) => deleteDokumenBoQ(trackingId, dokumenId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boq-detail", trackingId] });
    },
  });
}

export function useUpdateSubTotalBoQ(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { harga1?: number; harga2?: number; harga3?: number }) =>
      updateSubTotalBoQ(trackingId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boq-detail", trackingId] });
    },
  });
}

export function useUpdateStatusBoQ(trackingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      status,
      alasanPenolakan,
    }: {
      status: string;
      alasanPenolakan?: string;
    }) => updateStatusBoQ(trackingId, status, alasanPenolakan),

    onSuccess: () => {
      // Mengambil ulang data detail penawaran agar step selanjutnya terbuka
      // Sesuaikan key query dengan yang Anda gunakan di useDetailPenawaran
      queryClient.invalidateQueries({ queryKey: ["penawaran", trackingId] });
      queryClient.invalidateQueries({ queryKey: ["boq-detail", trackingId] });
    },
    onError: (error: Error) => {
      console.error("Update status failed:", error.message);
      // Anda bisa menambahkan toast notification di sini
    },
  });
}
