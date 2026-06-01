import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryClient';

import {
  createMarketPlan,
  deleteMarketPlan,
  getMarketPlan,
  getMarketPlanPreview,
  listMarketPlans,
} from '../market';

import type { QueryParams } from '../common';

export const marketKeys = queryKeys.market;

export function useMarketPlansQuery(params?: QueryParams) {
  return useQuery({ queryKey: marketKeys.plans(params), queryFn: () => listMarketPlans(params) });
}

export function useMarketPlanPreviewQuery(marketPlanId: string) {
  return useQuery({
    queryKey: marketKeys.preview(marketPlanId),
    queryFn: () => getMarketPlanPreview(marketPlanId),
    enabled: !!marketPlanId,
  });
}

export function useMarketPlanQuery(marketPlanId: string) {
  return useQuery({
    queryKey: marketKeys.detail(marketPlanId),
    queryFn: () => getMarketPlan(marketPlanId),
    enabled: !!marketPlanId,
  });
}

export function useCreateMarketPlanMutation() {
  return useMutation({ mutationFn: createMarketPlan });
}

export function useDeleteMarketPlanMutation() {
  return useMutation({ mutationFn: deleteMarketPlan });
}
