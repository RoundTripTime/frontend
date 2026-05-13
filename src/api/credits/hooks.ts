import { useMutation, useQuery } from '@tanstack/react-query';

import { completeAd, getCreditBalance, listCreditHistory, startAd } from '../credits';

import type { QueryParams } from '../common';

export const creditKeys = {
  balance: ['credits', 'me'] as const,
  history: (params?: QueryParams) => ['credits', 'me', 'history', params] as const,
};

export function useCreditBalanceQuery() {
  return useQuery({ queryKey: creditKeys.balance, queryFn: getCreditBalance });
}

export function useCreditHistoryQuery(params?: QueryParams) {
  return useQuery({
    queryKey: creditKeys.history(params),
    queryFn: () => listCreditHistory(params),
  });
}

export function useStartAdMutation() {
  return useMutation({ mutationFn: startAd });
}

export function useCompleteAdMutation() {
  return useMutation({ mutationFn: completeAd });
}
