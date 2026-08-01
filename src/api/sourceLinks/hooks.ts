import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryClient';

import { listSourceLinks, submitSourceLink } from '../sourceLinks';

import type { QueryParams } from '../common';

export const sourceLinkKeys = queryKeys.sourceLinks;

export function useSourceLinksQuery(params?: QueryParams) {
  return useQuery({
    queryKey: sourceLinkKeys.list(params),
    queryFn: () => listSourceLinks(params),
  });
}

export function useSubmitSourceLinkMutation() {
  return useMutation({ mutationFn: submitSourceLink });
}
