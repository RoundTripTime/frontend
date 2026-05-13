import { apiClient } from './client';

import type { QueryParams } from './common';
import type {
  CreatePlaceReviewRequest,
  DiscoverResponse,
  PlaceDetail,
  PlaceReview,
  PlaceReviewsResponse,
  PlaceSearchResponse,
  PlaceSourceLinksResponse,
  SimilarPlacesResponse,
} from './places/types';

export async function getPlace(placeId: string) {
  const { data } = await apiClient.get<PlaceDetail>(`/places/${placeId}`);
  return data;
}

export async function searchPlaces(params: QueryParams) {
  const { data } = await apiClient.get<PlaceSearchResponse>('/places/search', { params });
  return data;
}

export async function getSimilarPlaces(params: QueryParams) {
  const { data } = await apiClient.get<SimilarPlacesResponse>('/places/similar', { params });
  return data;
}

export async function discoverPlaces(params?: QueryParams) {
  const { data } = await apiClient.get<DiscoverResponse>('/discover', { params });
  return data;
}

export async function listPlaceReviews(placeId: string, params?: QueryParams) {
  const { data } = await apiClient.get<PlaceReviewsResponse>(`/places/${placeId}/reviews`, {
    params,
  });
  return data;
}

export async function createPlaceReview(placeId: string, body: CreatePlaceReviewRequest) {
  const { data } = await apiClient.post<PlaceReview>(`/places/${placeId}/reviews`, body);
  return data;
}

export async function deletePlaceReview(placeId: string, reviewId: string) {
  await apiClient.delete(`/places/${placeId}/reviews/${reviewId}`);
}

export async function listPlaceSourceLinks(placeId: string) {
  const { data } = await apiClient.get<PlaceSourceLinksResponse>(`/places/${placeId}/source-links`);
  return data;
}
