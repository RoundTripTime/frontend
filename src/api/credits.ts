import { apiClient } from './client';

import type { QueryParams } from './common';
import type {
  CompleteAdRequest,
  CompleteAdResponse,
  CreditBalance,
  CreditHistoryResponse,
  StartAdResponse,
} from './credits/types';

export async function getCreditBalance() {
  const { data } = await apiClient.get<CreditBalance>('/credits/me');
  return data;
}

export async function listCreditHistory(params?: QueryParams) {
  const { data } = await apiClient.get<CreditHistoryResponse>('/credits/me/history', { params });
  return data;
}

export async function startAd() {
  const { data } = await apiClient.post<StartAdResponse>('/credits/ads/start');
  return data;
}

export async function completeAd(body: CompleteAdRequest) {
  const { data } = await apiClient.post<CompleteAdResponse>('/credits/ads/complete', body);
  return data;
}
