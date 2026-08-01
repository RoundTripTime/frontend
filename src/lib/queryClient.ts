import { QueryClient } from '@tanstack/react-query';

type QueryKeyParams = unknown;
const appRoot = ['app'] as const;
const candidatesRoot = [...appRoot, 'candidates'] as const;
const collectionsRoot = [...appRoot, 'collections'] as const;
const creditsRoot = [...appRoot, 'credits'] as const;
const itinerariesRoot = [...appRoot, 'itineraries'] as const;
const jobsRoot = [...appRoot, 'jobs'] as const;
const marketRoot = [...appRoot, 'market'] as const;
const notificationsRoot = [...appRoot, 'notifications'] as const;
const placesRoot = [...appRoot, 'places'] as const;
const plansRoot = [...appRoot, 'plans'] as const;
const publicSharesRoot = [...appRoot, 'public-shares'] as const;
const sourceLinksRoot = [...appRoot, 'source-links'] as const;
const usersRoot = [...appRoot, 'users'] as const;
const communityRoot = [...appRoot, 'community'] as const;

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
  all: appRoot,
  candidates: {
    all: () => candidatesRoot,
    byJob: (jobId: string) => [...candidatesRoot, 'job', jobId] as const,
  },
  collections: {
    all: () => collectionsRoot,
    lists: [...collectionsRoot, 'list'] as const,
    places: (collectionId: string) =>
      [...collectionsRoot, 'detail', collectionId, 'places'] as const,
    share: (collectionId: string) => [...collectionsRoot, 'detail', collectionId, 'share'] as const,
  },
  credits: {
    all: () => creditsRoot,
    balance: [...creditsRoot, 'me'] as const,
    history: (params?: QueryKeyParams) => [...creditsRoot, 'me', 'history', params] as const,
  },
  itineraries: {
    all: () => itinerariesRoot,
    lists: [...itinerariesRoot, 'list'] as const,
    list: (params?: QueryKeyParams) => [...itinerariesRoot, 'list', params] as const,
    detail: (itineraryId: string) => [...itinerariesRoot, 'detail', itineraryId] as const,
    share: (itineraryId: string) => [...itinerariesRoot, 'detail', itineraryId, 'share'] as const,
    ota: (itineraryId: string, params: QueryKeyParams) =>
      [...itinerariesRoot, 'detail', itineraryId, 'ota-links', params] as const,
  },
  jobs: {
    all: () => jobsRoot,
    detail: (jobId: string) => [...jobsRoot, 'detail', jobId] as const,
  },
  market: {
    all: () => marketRoot,
    plans: (params?: QueryKeyParams) => [...marketRoot, 'plans', 'list', params] as const,
    detail: (marketPlanId: string) => [...marketRoot, 'plans', 'detail', marketPlanId] as const,
    preview: (marketPlanId: string) =>
      [...marketRoot, 'plans', 'detail', marketPlanId, 'preview'] as const,
  },
  notifications: {
    all: () => notificationsRoot,
    list: (params?: QueryKeyParams) => [...notificationsRoot, 'list', params] as const,
  },
  places: {
    all: () => placesRoot,
    lists: () => [...placesRoot, 'list'] as const,
    detail: (placeId: string) => [...placesRoot, 'detail', placeId] as const,
    search: (params: QueryKeyParams) => [...placesRoot, 'search', params] as const,
    similar: (params: QueryKeyParams) => [...placesRoot, 'similar', params] as const,
    discover: (params?: QueryKeyParams) => [...placesRoot, 'discover', params] as const,
    reviews: (placeId: string, params?: QueryKeyParams) =>
      [...placesRoot, 'detail', placeId, 'reviews', params] as const,
    sourceLinks: (placeId: string) => [...placesRoot, 'detail', placeId, 'source-links'] as const,
  },
  plans: {
    all: () => plansRoot,
    lists: () => [...plansRoot, 'list'] as const,
    detail: (planId: string) => [...plansRoot, 'detail', planId] as const,
  },
  publicShare: {
    all: () => publicSharesRoot,
    itinerary: (shareToken: string) =>
      [...publicSharesRoot, 'itineraries', 'detail', shareToken] as const,
    collection: (shareToken: string) =>
      [...publicSharesRoot, 'collections', 'detail', shareToken] as const,
  },
  sourceLinks: {
    all: () => sourceLinksRoot,
    lists: [...sourceLinksRoot, 'list'] as const,
    list: (params?: QueryKeyParams) => [...sourceLinksRoot, 'list', params] as const,
  },
  users: {
    all: () => usersRoot,
    me: [...usersRoot, 'me'] as const,
    profile: (userId: string) => [...usersRoot, 'detail', userId, 'profile'] as const,
  },
  community: {
    all: () => communityRoot,
    feeds: () => [...communityRoot, 'feed'] as const,
    posts: (params?: QueryKeyParams) => [...communityRoot, 'posts', 'list', params] as const,
    postDetail: (postId: string) => [...communityRoot, 'posts', 'detail', postId] as const,
    post: (postId: string) => [...communityRoot, 'posts', 'detail', postId] as const,
    comments: (postId: string, params?: QueryKeyParams) =>
      [...communityRoot, 'posts', 'detail', postId, 'comments', params] as const,
  },
};
