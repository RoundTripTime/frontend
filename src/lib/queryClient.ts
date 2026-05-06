import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  all: ['app'] as const,
  places: {
    all: () => [...queryKeys.all, 'places'] as const,
    lists: () => [...queryKeys.places.all(), 'list'] as const,
    detail: (placeId: string) => [...queryKeys.places.all(), 'detail', placeId] as const,
  },
  plans: {
    all: () => [...queryKeys.all, 'plans'] as const,
    lists: () => [...queryKeys.plans.all(), 'list'] as const,
    detail: (planId: string) => [...queryKeys.plans.all(), 'detail', planId] as const,
  },
  community: {
    all: () => [...queryKeys.all, 'community'] as const,
    feeds: () => [...queryKeys.community.all(), 'feed'] as const,
    posts: () => [...queryKeys.community.all(), 'posts'] as const,
    postDetail: (postId: string) => [...queryKeys.community.posts(), 'detail', postId] as const,
  },
};
