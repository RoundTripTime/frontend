import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createPlaceReview,
  deletePlaceReview,
  discoverPlaces,
  getPlace,
  getSimilarPlaces,
  listPlaceReviews,
  listPlaceSourceLinks,
  searchPlaces,
} from '../places';

import type { QueryParams } from '../common';

export const placeKeys = {
  detail: (placeId: string) => ['places', placeId] as const,
  search: (params: QueryParams) => ['places', 'search', params] as const,
  similar: (params: QueryParams) => ['places', 'similar', params] as const,
  discover: (params?: QueryParams) => ['discover', params] as const,
  reviews: (placeId: string, params?: QueryParams) =>
    ['places', placeId, 'reviews', params] as const,
  sourceLinks: (placeId: string) => ['places', placeId, 'source-links'] as const,
};

export function usePlaceQuery(placeId: string) {
  return useQuery({
    queryKey: placeKeys.detail(placeId),
    queryFn: () => getPlace(placeId),
    enabled: !!placeId,
  });
}

export function usePlaceSearchQuery(params: QueryParams) {
  return useQuery({
    queryKey: placeKeys.search(params),
    queryFn: () => searchPlaces(params),
    enabled: !!params.q,
  });
}

export function useSimilarPlacesQuery(params: QueryParams) {
  return useQuery({
    queryKey: placeKeys.similar(params),
    queryFn: () => getSimilarPlaces(params),
    enabled: !!params.place_id,
  });
}

export function useDiscoverPlacesQuery(params?: QueryParams) {
  return useQuery({ queryKey: placeKeys.discover(params), queryFn: () => discoverPlaces(params) });
}

export function usePlaceReviewsQuery(placeId: string, params?: QueryParams) {
  return useQuery({
    queryKey: placeKeys.reviews(placeId, params),
    queryFn: () => listPlaceReviews(placeId, params),
    enabled: !!placeId,
  });
}

export function useCreatePlaceReviewMutation(placeId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof createPlaceReview>[1]) => createPlaceReview(placeId, body),
  });
}

export function useDeletePlaceReviewMutation(placeId: string) {
  return useMutation({ mutationFn: (reviewId: string) => deletePlaceReview(placeId, reviewId) });
}

export function usePlaceSourceLinksQuery(placeId: string) {
  return useQuery({
    queryKey: placeKeys.sourceLinks(placeId),
    queryFn: () => listPlaceSourceLinks(placeId),
    enabled: !!placeId,
  });
}
