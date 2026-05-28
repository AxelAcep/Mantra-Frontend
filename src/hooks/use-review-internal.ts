/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDetailReviewInternal,
  uploadDokumenReviewInternal,
  deleteDokumenReviewInternal,
  updateStatusReviewInternal,
} from "@/services/review.internal.services";

export function useDetailReviewInternal(trackingId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["review-internal-detail", trackingId],
    queryFn: () => getDetailReviewInternal(trackingId!),
    enabled: !!trackingId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as any).message : null,
    refetch,
  };
}

export function useUploadDokumenReviewInternal(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ file }: { file: File }) =>
      uploadDokumenReviewInternal(trackingId, file),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["review-internal-detail", trackingId],
      });
    },
  });
}

export function useDeleteDokumenReviewInternal(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dokumenId: string) =>
      deleteDokumenReviewInternal(trackingId, dokumenId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["review-internal-detail", trackingId],
      });
    },
  });
}

export function useUpdateStatusReviewInternal(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      status,
      alasanPenolakan,
    }: {
      status: "ACC" | "PERLU_TINDAKAN" | "ON_PROGRESS";
      alasanPenolakan?: string;
    }) => updateStatusReviewInternal(trackingId, status, alasanPenolakan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran", trackingId] });
      qc.invalidateQueries({
        queryKey: ["review-internal-detail", trackingId],
      });
    },
    onError: (error: Error) => {
      console.error("Update status review internal failed:", error.message);
    },
  });
}
