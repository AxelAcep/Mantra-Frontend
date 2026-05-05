import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createTrackingPenawaran,
  type CreateTrackingPenawaranPayload,
  getPenawaranList,
  type GetPenawaranListParams,
} from "@/services/tracking-penawaran.service";

type State = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useCreateTrackingPenawaran() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    success: false,
  });

  const submit = async (payload: CreateTrackingPenawaranPayload) => {
    setState({ loading: true, error: null, success: false });
    try {
      await createTrackingPenawaran(payload);
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

export function usePenawaranList(params: GetPenawaranListParams = {}) {
  return useQuery({
    queryKey: ["penawaran-list", params],
    queryFn: () => getPenawaranList(params),
  });
}
