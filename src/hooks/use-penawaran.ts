// src/hooks/use-penawaran.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDetailTrackingPenawaran,
  assignPreSales,
  updateStatusPermintaanMasuk,
  getPenawaranChat,
  kirimPenawaranChat,
  updatePenawaranChat,
  readPenawaranChat,
  getUnreadPenawaranCount,
  getTotalUnreadPenawaranCount,
  uploadPenawaranDokumen,
  deletePenawaranDokumen,
  getPegawaiByDivisi,
  updateDetailTrackingPenawaran,
  assignMarketing,
  type StatusPermintaan,
} from "@/services/penawaran.services";

// ── Detail ─────────────────────────────────────────────────────────────────

export function useDetailPenawaran(id: string) {
  return useQuery({
    queryKey: ["penawaran-detail", id],
    queryFn: () => getDetailTrackingPenawaran(id),
    enabled: !!id,
  });
}

// ── Assign PreSales ────────────────────────────────────────────────────────

export function useAssignPreSales(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (preSalesId: string) => assignPreSales(trackingId, preSalesId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
    },
  });
}

// ── Update Status ──────────────────────────────────────────────────────────

export function useUpdateStatusPermintaan(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      status: StatusPermintaan;
      alasanPenolakan?: string;
    }) =>
      updateStatusPermintaanMasuk(
        trackingId,
        payload.status,
        payload.alasanPenolakan,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
    },
  });
}

// ── Chat: Get ──────────────────────────────────────────────────────────────

export function usePenawaranChat(trackingId: string, enabled = true) {
  return useQuery({
    queryKey: ["penawaran-chat", trackingId],
    queryFn: () => getPenawaranChat(trackingId),
    enabled: !!trackingId && enabled,
    refetchInterval: 5000, // polling tiap 5 detik
  });
}

// ── Chat: Kirim ────────────────────────────────────────────────────────────

export function useKirimPenawaranChat(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pesan: string) => kirimPenawaranChat(trackingId, pesan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-chat", trackingId] });
      qc.invalidateQueries({ queryKey: ["penawaran-chat-unread", trackingId] });
    },
  });
}

// ── Chat: Update ───────────────────────────────────────────────────────────

export function useUpdatePenawaranChat(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    // chatId diambil dari payload, bukan dari trackingId
    mutationFn: ({ chatId, pesan }: { chatId: string; pesan: string }) =>
      updatePenawaranChat(chatId, pesan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-chat", trackingId] });
    },
  });
}

// ── Chat: Read ─────────────────────────────────────────────────────────────

export function useReadPenawaranChat(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => readPenawaranChat(trackingId),
    onSuccess: () => {
      // Reset unread count setelah dibaca
      qc.invalidateQueries({ queryKey: ["penawaran-chat-unread", trackingId] });
      qc.invalidateQueries({ queryKey: ["penawaran-chat-unread-total"] });
    },
  });
}

// ── Chat: Unread Count (per tracking) ─────────────────────────────────────

export function useUnreadPenawaranCount(trackingId: string) {
  return useQuery({
    queryKey: ["penawaran-chat-unread", trackingId],
    queryFn: () => getUnreadPenawaranCount(trackingId),
    enabled: !!trackingId,
    refetchInterval: 10000,
  });
}

// ── Chat: Total Unread (semua tracking) ───────────────────────────────────

export function useTotalUnreadPenawaranCount() {
  return useQuery({
    queryKey: ["penawaran-chat-unread-total"],
    queryFn: () => getTotalUnreadPenawaranCount(),
    refetchInterval: 10000,
  });
}

export function usePegawaiByDivisi(divisi: string) {
  return useQuery({
    queryKey: ["pegawai", divisi],
    queryFn: () => getPegawaiByDivisi(divisi),
    enabled: !!divisi,
    staleTime: 5 * 60 * 1000,
  });
}

// use-penawaran.ts — tambah

export function useUploadPenawaranDokumen(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      permintaanMasukId,
      file,
    }: {
      permintaanMasukId: string;
      file: File;
    }) => uploadPenawaranDokumen(permintaanMasukId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
    },
  });
}

export function useDeletePenawaranDokumen(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      permintaanMasukId,
      dokumenId,
    }: {
      permintaanMasukId: string;
      dokumenId: string;
    }) => deletePenawaranDokumen(permintaanMasukId, dokumenId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
    },
  });
}

export function useUpdateDetailPenawaran(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      lokasiProyek: string;
    }) => updateDetailTrackingPenawaran(trackingId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
    },
  });
}

export function useAssignMarketing(trackingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (marketingId: string) =>
      assignMarketing(trackingId, marketingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penawaran-detail", trackingId] });
    },
  });
}
