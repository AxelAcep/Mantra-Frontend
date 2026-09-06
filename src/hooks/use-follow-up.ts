/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDetailFollowUp,
  uploadDokumenFollowUp,
  deleteDokumenFollowUp,
  updateStatusFollowUp,
  batalkanFollowUp,
} from "@/services/follow-up.services";

export function useDetailFollowUp(trackingId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["follow-up-detail", trackingId],
    queryFn: () => getDetailFollowUp(trackingId!),
    enabled: !!trackingId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as any).message : null,
    refetch,
  };
}

export function useUploadDokumenFollowUp(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ file, kategori }: { file: File; kategori?: string }) =>
      uploadDokumenFollowUp(trackingId, file, kategori),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["follow-up-detail", trackingId],
      });
    },
  });
}

export function useDeleteDokumenFollowUp(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dokumenId: string) =>
      deleteDokumenFollowUp(trackingId, dokumenId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["follow-up-detail", trackingId],
      });
    },
  });
}

export function useUpdateStatusFollowUp(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      stage?: number;
      status?: "ON_PROGRESS" | "KONFIRMASI_SELESAI" | "SELESAI" | "PERLU_TINDAKAN";
      alasanPenolakan?: string;
    }) => updateStatusFollowUp(trackingId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
      qc.invalidateQueries({
        queryKey: ["follow-up-detail", trackingId],
      });
    },
    onError: (error: Error) => {
      console.error("Update status follow up failed:", error.message);
    },
  });
}

export function useBatalkanFollowUp(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (alasan: string) => batalkanFollowUp(trackingId, alasan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
      qc.invalidateQueries({ queryKey: ["follow-up-detail", trackingId] });
    },
    onError: (error: Error) => {
      console.error("Batalkan follow up failed:", error.message);
    },
  });
}
