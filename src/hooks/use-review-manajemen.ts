/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDetailPersetujuanManajemen,
  uploadDokumenPersetujuanManajemen,
  deleteDokumenPersetujuanManajemen,
  updateStatusPersetujuanManajemen,
} from "@/services/review.managemen.services";

export function useDetailPersetujuanManajemen(trackingId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["persetujuan-manajemen-detail", trackingId],
    queryFn: () => getDetailPersetujuanManajemen(trackingId!),
    enabled: !!trackingId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as any).message : null,
    refetch,
  };
}

export function useUploadDokumenPersetujuanManajemen(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ file }: { file: File }) =>
      uploadDokumenPersetujuanManajemen(trackingId, file),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["persetujuan-manajemen-detail", trackingId],
      });
    },
  });
}

export function useDeleteDokumenPersetujuanManajemen(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dokumenId: string) =>
      deleteDokumenPersetujuanManajemen(trackingId, dokumenId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["persetujuan-manajemen-detail", trackingId],
      });
    },
  });
}

export function useUpdateStatusPersetujuanManajemen(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      status,
      alasanPenolakan,
    }: {
      status: "SELESAI" | "PERLU_TINDAKAN" | "ON_PROGRESS";
      alasanPenolakan?: string;
    }) => updateStatusPersetujuanManajemen(trackingId, status, alasanPenolakan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran", trackingId] });
      qc.invalidateQueries({
        queryKey: ["persetujuan-manajemen-detail", trackingId],
      });
    },
    onError: (error: Error) => {
      console.error(
        "Update status persetujuan manajemen failed:",
        error.message,
      );
    },
  });
}
