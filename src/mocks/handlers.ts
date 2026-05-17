import {
  mockAccessToken,
  mockItineraries,
  mockPlaces,
  mockRefreshToken,
  mockUser,
} from '@/src/mocks/fixtures';

import type { InternalAxiosRequestConfig } from 'axios';

type MockMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST';

export type MockResponse = {
  data: unknown;
  headers?: Record<string, string>;
  status: number;
  statusText?: string;
};

type MockRequest = {
  body: unknown;
  method: MockMethod;
  params: Record<string, string>;
  path: string;
  query: URLSearchParams;
};

type MockHandler = {
  method: MockMethod;
  path: string;
  resolve: (request: MockRequest) => MockResponse | Promise<MockResponse>;
};

const json = (data: unknown, status = 200): MockResponse => ({
  data,
  status,
  statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
});

const empty = (status = 204): MockResponse => ({
  data: null,
  status,
  statusText: 'No Content',
});

function parseBody(data: unknown) {
  if (typeof data !== 'string') {
    return data;
  }

  try {
    return JSON.parse(data) as unknown;
  } catch {
    return data;
  }
}

function normalizePath(path: string) {
  return path.replace(/\/+$/, '') || '/';
}

function matchPath(pattern: string, path: string) {
  const patternParts = normalizePath(pattern).split('/').filter(Boolean);
  const pathParts = normalizePath(path).split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  return patternParts.reduce<Record<string, string> | null>((params, part, index) => {
    if (!params) {
      return null;
    }

    const value = pathParts[index];

    if (!value) {
      return null;
    }

    if (part.startsWith(':')) {
      return {
        ...params,
        [part.slice(1)]: decodeURIComponent(value),
      };
    }

    return part === value ? params : null;
  }, {});
}

function createMockRequest(
  config: InternalAxiosRequestConfig,
  handler: MockHandler,
  url: URL,
  method: MockMethod,
): MockRequest | null {
  const params = matchPath(handler.path, url.pathname);

  if (!params) {
    return null;
  }

  return {
    body: parseBody(config.data),
    method,
    params,
    path: url.pathname,
    query: url.searchParams,
  };
}

export const handlers: MockHandler[] = [
  {
    method: 'POST',
    path: '/auth/social',
    resolve: () =>
      json(
        {
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken,
          user: mockUser,
        },
        201,
      ),
  },
  {
    method: 'POST',
    path: '/auth/refresh',
    resolve: () =>
      json({
        access_token: mockAccessToken,
      }),
  },
  { method: 'DELETE', path: '/auth/session', resolve: () => empty() },
  {
    method: 'GET',
    path: '/users/me',
    resolve: () =>
      json({
        ...mockUser,
        home_region: '서울',
        map_provider: 'kakao',
        created_at: '2026-05-16T00:00:00Z',
      }),
  },
  {
    method: 'PATCH',
    path: '/users/me',
    resolve: ({ body }) => {
      const patch = (body ?? {}) as Record<string, unknown>;

      return json({
        ...mockUser,
        ...patch,
        home_region: patch.home_region ?? '서울',
        map_provider: patch.map_provider ?? 'kakao',
        created_at: '2026-05-16T00:00:00Z',
      });
    },
  },
  { method: 'DELETE', path: '/users/me', resolve: () => empty() },
  {
    method: 'POST',
    path: '/source-links',
    resolve: () =>
      json(
        {
          source_link_id: 'mock-source-link',
          job_id: 'mock-job',
          job_status: 'pending',
          source_type: 'youtube_short',
          submitted_at: '2026-05-16T00:00:00Z',
        },
        201,
      ),
  },
  {
    method: 'GET',
    path: '/source-links',
    resolve: () =>
      json({
        items: [
          {
            source_link_id: 'mock-source-link',
            url: 'https://example.com/tokyo-food',
            source_type: 'youtube_short',
            title: '도쿄 맛집 VLOG',
            thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
            job_status: 'done',
            submitted_at: '2026-05-16T00:00:00Z',
          },
        ],
        next_cursor: null,
      }),
  },
  {
    method: 'GET',
    path: '/jobs/:jobId',
    resolve: () =>
      json({
        job_id: 'mock-job',
        source_link_id: 'mock-source-link',
        job_status: 'done',
        signal_count: 3,
        error_code: null,
        started_at: '2026-05-16T00:00:00Z',
        completed_at: '2026-05-16T00:00:02Z',
      }),
  },
  {
    method: 'GET',
    path: '/jobs/:jobId/candidates',
    resolve: () =>
      json({
        source_link: {
          url: 'https://example.com/tokyo-food',
          title: '도쿄 맛집 VLOG',
          thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
        },
        candidates: mockPlaces.slice(0, 1).map((place, index) => ({
          candidate_id: `mock-candidate-${index + 1}`,
          candidate_name: place.canonical_name,
          category: place.category,
          confidence_score: 0.92,
          rank_order: index + 1,
          requires_confirmation: false,
          status: 'proposed',
          evidence: place.evidence,
          place,
        })),
      }),
  },
  {
    method: 'PATCH',
    path: '/candidates/:candidateId',
    resolve: ({ body, params }) => {
      const patch = (body ?? {}) as { status?: string };

      return json({
        candidate_id: params.candidateId,
        candidate_name: '도쿄 감성 카페',
        category: '카페',
        confidence_score: 0.92,
        rank_order: 1,
        requires_confirmation: false,
        status: patch.status ?? 'accepted',
        evidence: mockPlaces[0]?.evidence,
        place: mockPlaces[0],
      });
    },
  },
  {
    method: 'POST',
    path: '/candidates/batch',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as {
        candidates?: { candidate_id: string; status: 'accepted' | 'rejected' }[];
      };

      return json({
        updated: payload.candidates ?? [],
        failed: [],
      });
    },
  },
  { method: 'GET', path: '/places/search', resolve: () => json({ results: mockPlaces }) },
  {
    method: 'GET',
    path: '/places/similar',
    resolve: () =>
      json({
        results: mockPlaces.map((place) => ({ ...place, similarity_score: 0.91 })),
      }),
  },
  {
    method: 'GET',
    path: '/discover',
    resolve: () =>
      json({
        results: mockPlaces.map((place) => ({ ...place, similarity_score: 0.87 })),
      }),
  },
  {
    method: 'GET',
    path: '/places/:placeId',
    resolve: ({ params }) => {
      const place = mockPlaces.find((item) => item.place_id === params.placeId) ?? mockPlaces[0];

      return place
        ? json(place)
        : json(
            { error: { code: 'PLACE_NOT_FOUND', message: '해당 장소를 찾을 수 없습니다.' } },
            404,
          );
    },
  },
  {
    method: 'GET',
    path: '/places/:placeId/reviews',
    resolve: () => json({ items: [], next_cursor: null }),
  },
  {
    method: 'POST',
    path: '/places/:placeId/reviews',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as { content?: string; rating?: number };

      return json(
        {
          review_id: 'mock-review',
          author: mockUser,
          rating: payload.rating ?? 5,
          content: payload.content ?? '',
          created_at: '2026-05-16T00:00:00Z',
        },
        201,
      );
    },
  },
  { method: 'DELETE', path: '/places/:placeId/reviews/:reviewId', resolve: () => empty() },
  {
    method: 'GET',
    path: '/places/:placeId/source-links',
    resolve: () =>
      json({
        items: [
          {
            source_link_id: 'mock-source-link',
            url: 'https://example.com/tokyo-food',
            platform: 'youtube_short',
            title: '도쿄 맛집 VLOG',
            thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
            submitted_at: '2026-05-16T00:00:00Z',
          },
        ],
      }),
  },
  {
    method: 'GET',
    path: '/collections',
    resolve: () =>
      json({
        items: [
          {
            collection_id: 'default',
            name: '저장한 플레이스',
            is_default: true,
            icon: null,
            place_count: mockPlaces.length,
            visibility: 'private',
          },
        ],
      }),
  },
  { method: 'POST', path: '/collections', resolve: ({ body }) => json(body, 201) },
  { method: 'PATCH', path: '/collections/:collectionId', resolve: ({ body }) => json(body) },
  { method: 'DELETE', path: '/collections/:collectionId', resolve: () => empty() },
  {
    method: 'GET',
    path: '/collections/:collectionId/places',
    resolve: () =>
      json({
        collection_id: 'default',
        name: '저장한 플레이스',
        visibility: 'private',
        places: mockPlaces,
      }),
  },
  { method: 'POST', path: '/collections/:collectionId/places', resolve: () => empty(201) },
  { method: 'DELETE', path: '/collections/:collectionId/places/:placeId', resolve: () => empty() },
  {
    method: 'GET',
    path: '/collections/:collectionId/share',
    resolve: () =>
      json({
        share_url: 'https://app.example.com/share/collections/mock',
        visibility: 'public',
      }),
  },
  {
    method: 'GET',
    path: '/itineraries',
    resolve: () => json({ items: mockItineraries, next_cursor: null }),
  },
  {
    method: 'POST',
    path: '/itineraries',
    resolve: ({ body }) =>
      json(
        {
          itinerary_id: 'draft-plan',
          visibility: 'private',
          status: 'draft',
          items: [],
          ...((body ?? {}) as Record<string, unknown>),
        },
        201,
      ),
  },
  {
    method: 'GET',
    path: '/itineraries/:itineraryId',
    resolve: () =>
      json({
        ...mockItineraries[0],
        items: [
          {
            item_id: 'mock-item-1',
            place_id: 'tokyo-cafe',
            place_name: '도쿄 감성 카페',
            day_index: 1,
            sort_order: 1,
            planned_duration_minutes: 60,
          },
        ],
      }),
  },
  { method: 'PATCH', path: '/itineraries/:itineraryId', resolve: ({ body }) => json(body) },
  { method: 'DELETE', path: '/itineraries/:itineraryId', resolve: () => empty() },
  {
    method: 'POST',
    path: '/itineraries/:itineraryId/items',
    resolve: ({ body }) => json(body, 201),
  },
  {
    method: 'PATCH',
    path: '/itineraries/:itineraryId/items/:itemId',
    resolve: ({ body }) => json(body),
  },
  { method: 'DELETE', path: '/itineraries/:itineraryId/items/:itemId', resolve: () => empty() },
  { method: 'POST', path: '/itineraries/:itineraryId/items/reorder', resolve: () => empty(200) },
  {
    method: 'GET',
    path: '/itineraries/:itineraryId/share',
    resolve: () =>
      json({
        share_url: 'https://app.example.com/share/itineraries/mock',
        visibility: 'public',
      }),
  },
  {
    method: 'GET',
    path: '/itineraries/:itineraryId/ota-links',
    resolve: () => json({ ota_url: 'https://partner.ota.com/search?dest=tokyo' }),
  },
  {
    method: 'POST',
    path: '/itineraries/:itineraryId/agent',
    resolve: () =>
      json({
        reply: '동선을 최적화했어요.',
        tool_results: [],
        itinerary_updated: false,
      }),
  },
  {
    method: 'GET',
    path: '/community/posts',
    resolve: () =>
      json({
        items: [
          {
            post_id: 'sample-post',
            author: mockUser,
            content: '도쿄 3박 4일 동선이 좋아서 공유합니다.',
            tagged_places: [],
            tagged_itinerary: { itinerary_id: 'draft-plan', title: '도쿄 여름 여행' },
            like_count: 24,
            comment_count: 6,
            is_liked: false,
            created_at: '2026-05-16T00:00:00Z',
          },
        ],
        next_cursor: null,
      }),
  },
  { method: 'POST', path: '/community/posts', resolve: ({ body }) => json(body, 201) },
  {
    method: 'GET',
    path: '/community/posts/:postId',
    resolve: ({ params }) =>
      json({
        post_id: params.postId,
        author: mockUser,
        content: '도쿄 3박 4일 동선이 좋아서 공유합니다.',
        tagged_places: [],
        tagged_itinerary: { itinerary_id: 'draft-plan', title: '도쿄 여름 여행' },
        like_count: 24,
        comment_count: 6,
        is_liked: false,
        created_at: '2026-05-16T00:00:00Z',
      }),
  },
  { method: 'DELETE', path: '/community/posts/:postId', resolve: () => empty() },
  {
    method: 'POST',
    path: '/community/posts/:postId/like',
    resolve: () => json({ like_count: 25 }, 201),
  },
  {
    method: 'DELETE',
    path: '/community/posts/:postId/like',
    resolve: () => json({ like_count: 24 }),
  },
  {
    method: 'GET',
    path: '/community/posts/:postId/comments',
    resolve: () => json({ items: [], next_cursor: null }),
  },
  {
    method: 'POST',
    path: '/community/posts/:postId/comments',
    resolve: ({ body }) => json(body, 201),
  },
  {
    method: 'DELETE',
    path: '/community/posts/:postId/comments/:commentId',
    resolve: () => empty(),
  },
  {
    method: 'GET',
    path: '/users/:userId/profile',
    resolve: () =>
      json({
        ...mockUser,
        user_id: mockUser.id,
        follower_count: 42,
        following_count: 18,
        post_count: 7,
        is_following: false,
      }),
  },
  { method: 'POST', path: '/users/:userId/follow', resolve: () => empty(201) },
  { method: 'DELETE', path: '/users/:userId/follow', resolve: () => empty() },
  {
    method: 'GET',
    path: '/market/plans',
    resolve: () =>
      json({
        items: [
          {
            market_plan_id: 'sample-market-plan',
            title: '도쿄 3박 4일 완벽 코스',
            destination_region: '도쿄, 일본',
            duration_nights: 3,
            party_size: 2,
            credit_price: 1,
            author: mockUser,
            cover_thumbnail_url: 'https://cdn.example.com/places/tokyo-cafe.jpg',
            highlight: '현지인만 아는 골목 맛집 5곳 포함',
            place_count: 8,
            view_count: 2341,
            is_ota_verified: true,
            created_at: '2026-05-16T00:00:00Z',
          },
        ],
        next_cursor: null,
      }),
  },
  { method: 'POST', path: '/market/plans', resolve: ({ body }) => json(body, 201) },
  {
    method: 'GET',
    path: '/market/plans/:marketPlanId/preview',
    resolve: ({ params }) =>
      json({
        market_plan_id: params.marketPlanId,
        title: '도쿄 3박 4일 완벽 코스',
        destination_region: '도쿄, 일본',
        duration_nights: 3,
        party_size: 2,
        credit_price: 1,
        author: mockUser,
        description: '실제로 다녀온 도쿄 여행 플랜이에요.',
        highlight: '현지인만 아는 골목 맛집 5곳 포함',
        preview_places: [mockPlaces[0]],
        hidden_place_count: 7,
        view_count: 2341,
        is_purchased: false,
      }),
  },
  {
    method: 'GET',
    path: '/market/plans/:marketPlanId',
    resolve: ({ params }) =>
      json({
        market_plan_id: params.marketPlanId,
        title: '도쿄 3박 4일 완벽 코스',
        destination_region: '도쿄, 일본',
        duration_nights: 3,
        party_size: 2,
        author: mockUser,
        description: '실제로 다녀온 도쿄 여행 플랜이에요.',
        highlight: '시부야·신주쿠·아사쿠사를 모두 담은 알찬 일정',
        pros: '이동 동선이 짧아서 피로도가 낮았어요.',
        cons: '아사쿠사는 오전 일찍 가야 사람이 적어요.',
        tips: '스이카 카드를 미리 충전해두면 편해요.',
        days: [{ day_index: 1, items: [mockPlaces[0]] }],
        ota_booking_info: { booked_at: '2026-05-01', verified: true },
        view_count: 143,
        created_at: '2026-05-16T00:00:00Z',
      }),
  },
  { method: 'DELETE', path: '/market/plans/:marketPlanId', resolve: () => empty() },
  {
    method: 'GET',
    path: '/credits/me',
    resolve: () =>
      json({
        balance: 3,
        lifetime_earned: 25,
        lifetime_spent: 22,
      }),
  },
  {
    method: 'GET',
    path: '/credits/me/history',
    resolve: () => json({ items: [], next_cursor: null }),
  },
  {
    method: 'POST',
    path: '/credits/ads/start',
    resolve: () =>
      json(
        {
          ad_session_id: 'mock-ad-session',
          ad_url: 'https://ads.example.com/watch?token=mock',
          expires_at: '2026-05-16T00:05:00Z',
          viewed_today: 2,
          required_for_credit: 5,
        },
        201,
      ),
  },
  {
    method: 'POST',
    path: '/credits/ads/complete',
    resolve: () =>
      json({
        viewed_today: 3,
        required_for_credit: 5,
        credit_earned: false,
        balance: 3,
      }),
  },
  { method: 'GET', path: '/notifications', resolve: () => json({ items: [], next_cursor: null }) },
  {
    method: 'PATCH',
    path: '/notifications/:notificationId/read',
    resolve: ({ params }) =>
      json({
        notification_id: params.notificationId,
        is_read: true,
      }),
  },
  {
    method: 'GET',
    path: '/public/itineraries/:shareToken',
    resolve: () => json({ ...mockItineraries[0], items: [] }),
  },
  {
    method: 'GET',
    path: '/public/collections/:shareToken',
    resolve: () =>
      json({
        collection_id: 'default',
        name: '저장한 플레이스',
        visibility: 'public',
        places: mockPlaces,
      }),
  },
];

export async function resolveMockResponse(config: InternalAxiosRequestConfig) {
  const method = (config.method ?? 'GET').toUpperCase() as MockMethod;
  const baseURL = config.baseURL ?? 'https://api.example.com/v1';
  const url = new URL(config.url ?? '', baseURL);

  for (const handler of handlers) {
    if (handler.method !== method) {
      continue;
    }

    const request = createMockRequest(config, handler, url, method);

    if (request) {
      return handler.resolve(request);
    }
  }

  return null;
}
