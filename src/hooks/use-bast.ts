import { useCallback, useEffect, useState } from "react";
import {
  getDetailBast,
  createBastEntry,
  updateBastEntry,
  type BastResponse,
} from "@/services/bast.service";

export function useBast(trackingId: string) {
  const [bast, setBast] = useState<BastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchBast = useCallback(async () => {
    if (!trackingId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDetailBast(trackingId);
      setBast(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data BAST.",
      );
    } finally {
      setLoading(false);
    }
  }, [trackingId]);

  useEffect(() => {
    fetchBast();
  }, [fetchBast]);

  const addBastEntry = useCallback(
    async (payload: {
      noReferensi?: string;
      tanggalTerbit?: string;
      tanggalSerahTerima?: string;
    }) => {
      setCreating(true);
      setError(null);
      try {
        const data = await createBastEntry(trackingId, payload);
        setBast(data);
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal menambahkan entry BAST.",
        );
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [trackingId],
  );

  const updateBast = useCallback(
    async (
      entryId: string,
      payload: {
        noReferensi?: string;
        tanggalTerbit?: string;
        tanggalSerahTerima?: string;
      },
    ) => {
      setUpdating(true);
      setError(null);
      try {
        const data = await updateBastEntry(trackingId, entryId, payload);
        setBast(data);
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memperbarui detail BAST.",
        );
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [trackingId],
  );

  return {
    bast,
    loading,
    error,
    creating,
    updating,
    refetch: fetchBast,
    addBastEntry,
    updateBast,
  };
}
