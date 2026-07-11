/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDetailImplementasi,
  updateDetailImplementasi,
  addBarangImplementasi,
  updateBarangImplementasi,
  deleteBarangImplementasi,
} from "@/services/implementasi.services";

export function useDetailImplementasi(trackingId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["implementasi-detail", trackingId],
    queryFn: () => getDetailImplementasi(trackingId!),
    enabled: !!trackingId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as any).message : null,
    refetch,
  };
}

export function useUpdateDetailImplementasi(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      noPO?: string;
      tanggalPO?: string;
      noWO?: string;
      tanggalWO?: string;
      noDO?: string;
      tanggalDO?: string;
    }) => updateDetailImplementasi(trackingId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
      qc.invalidateQueries({ queryKey: ["implementasi-detail", trackingId] });
    },
    onError: (error: Error) => {
      console.error("Update detail implementasi failed:", error.message);
    },
  });
}

export function useAddBarangImplementasi(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      namaBarang: string;
      status: string;
      qty: number;
      satuan: string;
      hargaSatuan: number;
      metode: string;
      estimasiKedatangan?: string;
    }) => addBarangImplementasi(trackingId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["implementasi-detail", trackingId] });
    },
    onError: (error: Error) => {
      console.error("Add barang implementasi failed:", error.message);
    },
  });
}

export function useUpdateBarangImplementasi(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      barangId,
      payload,
    }: {
      barangId: string;
      payload: {
        namaBarang: string;
        status: string;
        qty: number;
        satuan: string;
        hargaSatuan: number;
        metode: string;
        estimasiKedatangan?: string;
      };
    }) => updateBarangImplementasi(trackingId, barangId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["implementasi-detail", trackingId] });
    },
    onError: (error: Error) => {
      console.error("Update barang implementasi failed:", error.message);
    },
  });
}

export function useDeleteBarangImplementasi(trackingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (barangId: string) => deleteBarangImplementasi(trackingId, barangId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["implementasi-detail", trackingId] });
    },
    onError: (error: Error) => {
      console.error("Delete barang implementasi failed:", error.message);
    },
  });
}
