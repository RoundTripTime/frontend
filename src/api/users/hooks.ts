import { useMutation, useQuery } from '@tanstack/react-query';

import { deleteMe, getMe, updateMe } from '../users';

export const userKeys = {
  me: ['users', 'me'] as const,
};

export function useMeQuery() {
  return useQuery({ queryKey: userKeys.me, queryFn: getMe });
}

export function useUpdateMeMutation() {
  return useMutation({ mutationFn: updateMe });
}

export function useDeleteMeMutation() {
  return useMutation({ mutationFn: deleteMe });
}
