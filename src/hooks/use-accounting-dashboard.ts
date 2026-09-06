import { useQuery } from "@tanstack/react-query";
import {
  getAccountingSummary,
  getAccountingPOList,
  type GetAccountingPOListParams,
} from "@/services/accounting-dashboard.service";

export function useAccountingSummary(enabled = true) {
  return useQuery({
    queryKey: ["accounting-summary"],
    queryFn: getAccountingSummary,
    enabled,
  });
}

export function useAccountingPOList(
  params: GetAccountingPOListParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["accounting-po-list", params],
    queryFn: () => getAccountingPOList(params),
    enabled,
  });
}
