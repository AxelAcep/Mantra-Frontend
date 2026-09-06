import { useCallback, useEffect, useState } from "react";
import {
  getDetailGaransi,
  konfigurasiGaransi,
  updateTanggalKunjunganGaransi,
  type GaransiResponse,
} from "@/services/garansi.service";

export function useGaransi(trackingId: string) {
  const [garansi, setGaransi] = useState<GaransiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [konfiguring, setKonfiguring] = useState(false);
  const [updatingTanggal, setUpdatingTanggal] = useState(false);

  const fetchGaransi = useCallback(async () => {
    if (!trackingId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDetailGaransi(trackingId);
      setGaransi(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data Garansi.",
      );
    } finally {
      setLoading(false);
    }
  }, [trackingId]);

  useEffect(() => {
    fetchGaransi();
  }, [fetchGaransi]);

  const konfigurasiTimeline = useCallback(
    async (payload: {
      lamaTahun: number;
      bulanMulai: number;
      tahunMulai: number;
    }) => {
      setKonfiguring(true);
      setError(null);
      try {
        const data = await konfigurasiGaransi(trackingId, payload);
        setGaransi(data);
        return data;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengkonfigurasi timeline Garansi.",
        );
        throw err;
      } finally {
        setKonfiguring(false);
      }
    },
    [trackingId],
  );

  const updateTanggalKunjungan = useCallback(
    async (monthId: string, tanggalKunjungan: string) => {
      setUpdatingTanggal(true);
      setError(null);
      try {
        const data = await updateTanggalKunjunganGaransi(trackingId, monthId, {
          tanggalKunjungan,
        });
        setGaransi(data);
        return data;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memperbarui tanggal kunjungan.",
        );
        throw err;
      } finally {
        setUpdatingTanggal(false);
      }
    },
    [trackingId],
  );

  return {
    garansi,
    loading,
    error,
    konfiguring,
    updatingTanggal,
    refetch: fetchGaransi,
    konfigurasiTimeline,
    updateTanggalKunjungan,
  };
}
