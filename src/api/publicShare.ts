import { apiClient } from './client';

import type { PublicCollection, PublicItinerary } from './publicShare/types';

export async function getPublicItinerary(shareToken: string) {
  const { data } = await apiClient.get<PublicItinerary>(`/public/itineraries/${shareToken}`);
  return data;
}

export async function getPublicCollection(shareToken: string) {
  const { data } = await apiClient.get<PublicCollection>(`/public/collections/${shareToken}`);
  return data;
}
