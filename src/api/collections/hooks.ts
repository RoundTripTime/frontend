import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryClient';

import {
  addCollectionPlace,
  createCollection,
  deleteCollection,
  getCollectionShare,
  listCollectionPlaces,
  listCollections,
  removeCollectionPlace,
  updateCollection,
} from '../collections';

export const collectionKeys = queryKeys.collections;

export function useCollectionsQuery() {
  return useQuery({ queryKey: collectionKeys.lists, queryFn: listCollections });
}

export function useCreateCollectionMutation() {
  return useMutation({ mutationFn: createCollection });
}

export function useUpdateCollectionMutation() {
  return useMutation({
    mutationFn: ({
      collectionId,
      body,
    }: {
      collectionId: string;
      body: Parameters<typeof updateCollection>[1];
    }) => updateCollection(collectionId, body),
  });
}

export function useDeleteCollectionMutation() {
  return useMutation({ mutationFn: deleteCollection });
}

export function useCollectionPlacesQuery(collectionId: string) {
  return useQuery({
    queryKey: collectionKeys.places(collectionId),
    queryFn: () => listCollectionPlaces(collectionId),
    enabled: !!collectionId,
  });
}

export function useAddCollectionPlaceMutation(collectionId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof addCollectionPlace>[1]) =>
      addCollectionPlace(collectionId, body),
  });
}

export function useRemoveCollectionPlaceMutation(collectionId: string) {
  return useMutation({
    mutationFn: (placeId: string) => removeCollectionPlace(collectionId, placeId),
  });
}

export function useCollectionShareQuery(collectionId: string) {
  return useQuery({
    queryKey: collectionKeys.share(collectionId),
    queryFn: () => getCollectionShare(collectionId),
    enabled: !!collectionId,
  });
}
