import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryClient';

import { deleteMe, getMe, updateMe } from '../users';

export const userKeys = queryKeys.users;

export function useMeQuery() {
  return useQuery({ queryKey: userKeys.me, queryFn: getMe });
}

export function useUpdateMeMutation() {
  return useMutation({ mutationFn: updateMe });
}

export function useDeleteMeMutation() {
  return useMutation({ mutationFn: deleteMe });
}
