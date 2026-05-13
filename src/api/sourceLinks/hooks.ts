import { useMutation, useQuery } from '@tanstack/react-query';

import { listSourceLinks, submitSourceLink } from '../sourceLinks';

import type { QueryParams } from '../common';

export const sourceLinkKeys = {
  lists: ['source-links'] as const,
  list: (params?: QueryParams) => [...sourceLinkKeys.lists, params] as const,
};

export function useSourceLinksQuery(params?: QueryParams) {
  return useQuery({
    queryKey: sourceLinkKeys.list(params),
    queryFn: () => listSourceLinks(params),
  });
}

export function useSubmitSourceLinkMutation() {
  return useMutation({ mutationFn: submitSourceLink });
}
