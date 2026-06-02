import React from "react";
import type { TrackingPenawaranDetail } from "@/services/penawaran.services";
import type { LogEntry } from "../pages/detail-pengadaan-barang/penawaran/step1/index";

export function usePenawaranLogs(data?: TrackingPenawaranDetail): LogEntry[] {
  return React.useMemo(() => {
    const result: LogEntry[] = [];

    if (data?.permintaanMasuk?.activity) {
      const act = data.permintaanMasuk.activity;
      result.push({
        id: 1,
        user: "Sistem",
        action: `Activity dibuat: ${act.judul}`,
        time: new Date(act.waktuMulai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(act.waktuMulai).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        type: "system",
      });
    }

    if (data?.permintaanMasuk?.dokumen) {
      data.permintaanMasuk.dokumen.forEach((dok, i) => {
        result.push({
          id: i + 10,
          user: "Upload Dokumen",
          action: `Mengunggah file ${dok.namaFile}`,
          time: new Date(dok.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(dok.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          type: "user",
        });
      });
    }

    if (data?.permintaanMasuk?.logs) {
      data.permintaanMasuk.logs.forEach((log, i) => {
        result.push({
          id: i + 100,
          user: log.namaPegawai,
          action: `${log.aksi}${log.keterangan ? `: ${log.keterangan}` : ""}`,
          time: new Date(log.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(log.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          type: "system",
        });
      });
    }

    return result;
  }, [data]);
}
