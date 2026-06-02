import { useQuery } from "@tanstack/react-query";
import {
  getDetailTrackingPenawaran,
  type TrackingPenawaranDetail,
} from "@/services/tracking-penawaran.service";

export function useDetailTrackingPenawaran(id: string) {
  return useQuery({
    queryKey: ["tracking-penawaran", id],
    queryFn: () => getDetailTrackingPenawaran(id),
    enabled: !!id,
  });
}
