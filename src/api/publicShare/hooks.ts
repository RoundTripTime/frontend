import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryClient';

import { getPublicCollection, getPublicItinerary } from '../publicShare';

export const publicShareKeys = queryKeys.publicShare;

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
