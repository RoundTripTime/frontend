import { apiClient } from './client';

import type { QueryParams } from './common';
import type {
  CreateMarketPlanRequest,
  MarketPlan,
  MarketPlanListItem,
  MarketPlanPreview,
  MarketPlansResponse,
} from './market/types';

export async function listMarketPlans(params?: QueryParams) {
  const { data } = await apiClient.get<MarketPlansResponse>('/market/plans', { params });
  return data;
}

export async function createMarketPlan(body: CreateMarketPlanRequest) {
  const { data } = await apiClient.post<MarketPlanListItem>('/market/plans', body);
  return data;
}

export async function getMarketPlanPreview(marketPlanId: string) {
  const { data } = await apiClient.get<MarketPlanPreview>(`/market/plans/${marketPlanId}/preview`);
  return data;
}

export async function getMarketPlan(marketPlanId: string) {
  const { data } = await apiClient.get<MarketPlan>(`/market/plans/${marketPlanId}`);
  return data;
}

export async function deleteMarketPlan(marketPlanId: string) {
  await apiClient.delete(`/market/plans/${marketPlanId}`);
}
