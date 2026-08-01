import { apiClient } from './client';

import type { ShareLinkResponse } from './collections/types';
import type { QueryParams } from './common';
import type {
  CreateItineraryItemRequest,
  CreateItineraryRequest,
  ItinerariesResponse,
  Itinerary,
  ItineraryItem,
  OtaLinksResponse,
  ReorderItineraryItemsRequest,
  SendAgentMessageRequest,
  SendAgentMessageResponse,
  UpdateItineraryItemRequest,
  UpdateItineraryRequest,
} from './itineraries/types';

export async function listItineraries(params?: QueryParams) {
  const { data } = await apiClient.get<ItinerariesResponse>('/itineraries', { params });
  return data;
}

export async function createItinerary(body: CreateItineraryRequest) {
  const { data } = await apiClient.post<Itinerary>('/itineraries', body);
  return data;
}

export async function getItinerary(itineraryId: string) {
  const { data } = await apiClient.get<Itinerary>(`/itineraries/${itineraryId}`);
  return data;
}

export async function updateItinerary(itineraryId: string, body: UpdateItineraryRequest) {
  const { data } = await apiClient.patch<Itinerary>(`/itineraries/${itineraryId}`, body);
  return data;
}

export async function deleteItinerary(itineraryId: string) {
  await apiClient.delete(`/itineraries/${itineraryId}`);
}

export async function addItineraryItem(itineraryId: string, body: CreateItineraryItemRequest) {
  const { data } = await apiClient.post<ItineraryItem>(`/itineraries/${itineraryId}/items`, body);
  return data;
}

export async function updateItineraryItem(
  itineraryId: string,
  itemId: string,
  body: UpdateItineraryItemRequest,
) {
  const { data } = await apiClient.patch<ItineraryItem>(
    `/itineraries/${itineraryId}/items/${itemId}`,
    body,
  );
  return data;
}

export async function removeItineraryItem(itineraryId: string, itemId: string) {
  await apiClient.delete(`/itineraries/${itineraryId}/items/${itemId}`);
}

export async function reorderItineraryItems(
  itineraryId: string,
  body: ReorderItineraryItemsRequest,
) {
  await apiClient.post(`/itineraries/${itineraryId}/items/reorder`, body);
}

export async function getItineraryShare(itineraryId: string) {
  const { data } = await apiClient.get<ShareLinkResponse>(`/itineraries/${itineraryId}/share`);
  return data;
}

export async function getOtaLinks(itineraryId: string, params: QueryParams) {
  const { data } = await apiClient.get<OtaLinksResponse>(`/itineraries/${itineraryId}/ota-links`, {
    params,
  });
  return data;
}

export async function sendAgentMessage(itineraryId: string, body: SendAgentMessageRequest) {
  const { data } = await apiClient.post<SendAgentMessageResponse>(
    `/itineraries/${itineraryId}/agent`,
    body,
  );
  return data;
}
