import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addItineraryItem,
  createItinerary,
  deleteItinerary,
  getItinerary,
  getItineraryShare,
  getOtaLinks,
  listItineraries,
  removeItineraryItem,
  reorderItineraryItems,
  sendAgentMessage,
  updateItinerary,
  updateItineraryItem,
} from '../itineraries';

import type { QueryParams } from '../common';

export const itineraryKeys = {
  lists: ['itineraries'] as const,
  list: (params?: QueryParams) => [...itineraryKeys.lists, params] as const,
  detail: (itineraryId: string) => ['itineraries', itineraryId] as const,
  share: (itineraryId: string) => ['itineraries', itineraryId, 'share'] as const,
  ota: (itineraryId: string, params: QueryParams) =>
    ['itineraries', itineraryId, 'ota-links', params] as const,
};

export function useItinerariesQuery(params?: QueryParams) {
  return useQuery({ queryKey: itineraryKeys.list(params), queryFn: () => listItineraries(params) });
}

export function useItineraryQuery(itineraryId: string) {
  return useQuery({
    queryKey: itineraryKeys.detail(itineraryId),
    queryFn: () => getItinerary(itineraryId),
    enabled: !!itineraryId,
  });
}

export function useCreateItineraryMutation() {
  return useMutation({ mutationFn: createItinerary });
}

export function useUpdateItineraryMutation() {
  return useMutation({
    mutationFn: ({
      itineraryId,
      body,
    }: {
      itineraryId: string;
      body: Parameters<typeof updateItinerary>[1];
    }) => updateItinerary(itineraryId, body),
  });
}

export function useDeleteItineraryMutation() {
  return useMutation({ mutationFn: deleteItinerary });
}

export function useAddItineraryItemMutation(itineraryId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof addItineraryItem>[1]) =>
      addItineraryItem(itineraryId, body),
  });
}

export function useUpdateItineraryItemMutation(itineraryId: string) {
  return useMutation({
    mutationFn: ({
      itemId,
      body,
    }: {
      itemId: string;
      body: Parameters<typeof updateItineraryItem>[2];
    }) => updateItineraryItem(itineraryId, itemId, body),
  });
}

export function useRemoveItineraryItemMutation(itineraryId: string) {
  return useMutation({ mutationFn: (itemId: string) => removeItineraryItem(itineraryId, itemId) });
}

export function useReorderItineraryItemsMutation(itineraryId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof reorderItineraryItems>[1]) =>
      reorderItineraryItems(itineraryId, body),
  });
}

export function useItineraryShareQuery(itineraryId: string) {
  return useQuery({
    queryKey: itineraryKeys.share(itineraryId),
    queryFn: () => getItineraryShare(itineraryId),
    enabled: !!itineraryId,
  });
}

export function useItineraryShareMutation() {
  return useMutation({ mutationFn: getItineraryShare });
}

export function useOtaLinksQuery(itineraryId: string, params: QueryParams) {
  return useQuery({
    queryKey: itineraryKeys.ota(itineraryId, params),
    queryFn: () => getOtaLinks(itineraryId, params),
    enabled: !!itineraryId && !!params.type,
  });
}

export function useSendAgentMessageMutation(itineraryId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof sendAgentMessage>[1]) =>
      sendAgentMessage(itineraryId, body),
  });
}
