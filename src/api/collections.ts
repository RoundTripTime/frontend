import { apiClient } from './client';

import type {
  AddCollectionPlaceRequest,
  Collection,
  CollectionPlacesResponse,
  CollectionsResponse,
  CreateCollectionRequest,
  ShareLinkResponse,
  UpdateCollectionRequest,
} from './collections/types';

export async function listCollections() {
  const { data } = await apiClient.get<CollectionsResponse>('/collections');
  return data;
}

export async function createCollection(body: CreateCollectionRequest) {
  const { data } = await apiClient.post<Collection>('/collections', body);
  return data;
}

export async function updateCollection(collectionId: string, body: UpdateCollectionRequest) {
  const { data } = await apiClient.patch<Collection>(`/collections/${collectionId}`, body);
  return data;
}

export async function deleteCollection(collectionId: string) {
  await apiClient.delete(`/collections/${collectionId}`);
}

export async function listCollectionPlaces(collectionId: string) {
  const { data } = await apiClient.get<CollectionPlacesResponse>(
    `/collections/${collectionId}/places`,
  );
  return data;
}

export async function addCollectionPlace(collectionId: string, body: AddCollectionPlaceRequest) {
  await apiClient.post(`/collections/${collectionId}/places`, body);
}

export async function removeCollectionPlace(collectionId: string, placeId: string) {
  await apiClient.delete(`/collections/${collectionId}/places/${placeId}`);
}

export async function getCollectionShare(collectionId: string) {
  const { data } = await apiClient.get<ShareLinkResponse>(`/collections/${collectionId}/share`);
  return data;
}
