import { useQuery } from '@tanstack/react-query';

import { getPublicCollection, getPublicItinerary } from '../publicShare';

export const publicShareKeys = {
  itinerary: (shareToken: string) => ['public', 'itineraries', shareToken] as const,
  collection: (shareToken: string) => ['public', 'collections', shareToken] as const,
};

export function usePublicItineraryQuery(shareToken: string) {
  return useQuery({
    queryKey: publicShareKeys.itinerary(shareToken),
    queryFn: () => getPublicItinerary(shareToken),
    enabled: !!shareToken,
  });
}

export function usePublicCollectionQuery(shareToken: string) {
  return useQuery({
    queryKey: publicShareKeys.collection(shareToken),
    queryFn: () => getPublicCollection(shareToken),
    enabled: !!shareToken,
  });
}
