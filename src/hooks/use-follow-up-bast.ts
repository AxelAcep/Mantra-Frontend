/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  getDetailFollowUp,
  inputBASTFollowup,
  type FollowUpResponse,
} from "@/services/follow-up.services";

export function useFollowUpBast(trackingId: string) {
  const [followUp, setFollowUp] = useState<FollowUpResponse | null>(null);
  const [totalBast, setTotalBast] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingId) return;

    let active = true;
    setLoading(true);
    setError(null);

    getDetailFollowUp(trackingId)
      .then((data) => {
        if (!active) return;
        setFollowUp(data);
        setTotalBast(data.TotalBAST ?? 0);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message ?? "Gagal mengambil data Follow Up.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [trackingId]);

  async function submitBast() {
    setSubmitting(true);
    setError(null);
    try {
      const updated = await inputBASTFollowup(trackingId, {
        total_bast: totalBast,
      });
      setFollowUp(updated);
      setTotalBast(updated.TotalBAST ?? 0);
      return updated;
    } catch (err: any) {
      setError(err.message ?? "Gagal update Total BAST.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    followUp,
    totalBast,
    setTotalBast,
    loading,
    submitting,
    error,
    submitBast,
  };
}
