import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccounting,
  createAccounting,
  updateAccounting,
  bayarItemTermin,
  type UpsertAccountingPayload,
  type TerminPembayaran,
} from "@/services/accounting.services";

type State = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

const initState: State = {
  loading: false,
  error: null,
  success: false,
};

/* =========================================================
   1. GET ACCOUNTING (SUPPORT CREATE MODE)
========================================================= */
export function useAccounting(trackingId: string) {
  return useQuery<TerminPembayaran | null>({
    queryKey: ["accounting", trackingId],
    enabled: !!trackingId,

    queryFn: async () => {
      try {
        return await getAccounting(trackingId);
      } catch (err: unknown) {
        const e = err as Record<string, unknown>;

        const status =
          (e?.status as number | undefined) ??
          (e?.response as { status?: number } | undefined)?.status ??
          (e?.code as number | undefined);

        if (status === 404) {
          return null;
        }

        throw err;
      }
    },

    retry: false,
  });
}
/* =========================================================
   2. CREATE ACCOUNTING
========================================================= */
export function useCreateAccounting(trackingId: string) {
  const [state, setState] = useState<State>(initState);
  const queryClient = useQueryClient();

  const submit = async (payload: UpsertAccountingPayload) => {
    setState({ loading: true, error: null, success: false });

    try {
      await createAccounting(trackingId, payload);

      await queryClient.invalidateQueries({
        queryKey: ["accounting", trackingId],
      });

      setState({ loading: false, error: null, success: true });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : "Terjadi kesalahan.",
        success: false,
      });
    }
  };

  return { ...state, submit };
}

/* =========================================================
   3. UPDATE ACCOUNTING
========================================================= */
export function useUpdateAccounting(trackingId: string) {
  const [state, setState] = useState<State>(initState);
  const queryClient = useQueryClient();

  const submit = async (payload: UpsertAccountingPayload) => {
    setState({ loading: true, error: null, success: false });

    try {
      await updateAccounting(trackingId, payload);

      await queryClient.invalidateQueries({
        queryKey: ["accounting", trackingId],
      });

      setState({ loading: false, error: null, success: true });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : "Terjadi kesalahan.",
        success: false,
      });
    }
  };

  return { ...state, submit };
}

/* =========================================================
   4. BAYAR TERMIN ITEM
========================================================= */
export function useBayarItemTermin(trackingId: string) {
  const [state, setState] = useState<State>(initState);
  const queryClient = useQueryClient();

  const bayar = async (itemId: string) => {
    setState({ loading: true, error: null, success: false });

    try {
      await bayarItemTermin(trackingId, itemId);

      await queryClient.invalidateQueries({
        queryKey: ["accounting", trackingId],
      });

      setState({ loading: false, error: null, success: true });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : "Terjadi kesalahan.",
        success: false,
      });
    }
  };

  return { ...state, bayar };
}
