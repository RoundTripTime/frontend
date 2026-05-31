import {
  getSourceType,
  mockDb,
  nextMockId,
  page,
  toItineraryItem,
  toItineraryListItem,
} from '@/src/mocks/db';

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
          access_token: mockDb.accessToken,
          refresh_token: mockDb.refreshToken,
          user: mockDb.user,
        },
        201,
      ),
  },
  {
    method: 'POST',
    path: '/auth/refresh',
    resolve: () =>
      json({
        access_token: mockDb.accessToken,
      }),
  },
  { method: 'DELETE', path: '/auth/session', resolve: () => empty() },
  {
    method: 'GET',
    path: '/users/me',
    resolve: () => json(mockDb.user),
  },
  {
    method: 'PATCH',
    path: '/users/me',
    resolve: ({ body }) => {
      const patch = (body ?? {}) as Record<string, unknown>;
      mockDb.user = {
        ...mockDb.user,
        ...patch,
      };

      return json(mockDb.user);
    },
  },
  {
    method: 'DELETE',
    path: '/users/me',
    resolve: () => {
      mockDb.user.nickname = '탈퇴한 사용자';
      return empty();
    },
  },
  {
    method: 'POST',
    path: '/source-links',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as { url?: string };
      const sourceLinkId = nextMockId('source-link');
      const jobId = nextMockId('job');
      const submittedAt = new Date().toISOString();
      const sourceType = getSourceType(payload.url ?? 'https://example.com/mock');

      mockDb.sourceLinks.unshift({
        source_link_id: sourceLinkId,
        url: payload.url ?? 'https://example.com/mock',
        source_type: sourceType,
        title: sourceType === 'instagram_reel' ? '인스타그램 장소 릴스' : '새 영상 링크',
        thumbnail_url: 'https://cdn.example.com/source/mock.jpg',
        job_status: 'done',
        submitted_at: submittedAt,
      });

      mockDb.jobs.unshift({
        job_id: jobId,
        source_link_id: sourceLinkId,
        job_status: 'done',
        signal_count: mockDb.candidates.length,
        error_code: null,
        started_at: submittedAt,
        completed_at: submittedAt,
      });

      return json(
        {
          source_link_id: sourceLinkId,
          job_id: jobId,
          job_status: 'pending',
          source_type: sourceType,
          submitted_at: submittedAt,
        },
        201,
      );
    },
  },
  {
    method: 'GET',
    path: '/source-links',
    resolve: () => json(page(mockDb.sourceLinks)),
  },
  {
    method: 'GET',
    path: '/jobs/:jobId',
    resolve: ({ params }) => {
      const job = mockDb.jobs.find((item) => item.job_id === params.jobId) ?? mockDb.jobs[0];

      return job
        ? json(job)
        : json({ error: { code: 'JOB_NOT_FOUND', message: '분석 잡을 찾을 수 없습니다.' } }, 404);
    },
  },
  {
    method: 'GET',
    path: '/jobs/:jobId/candidates',
    resolve: () => {
      const sourceLink = mockDb.sourceLinks[0];

      return json({
        source_link: {
          url: sourceLink?.url ?? 'https://example.com/tokyo-food',
          title: sourceLink?.title ?? '도쿄 맛집 VLOG',
          thumbnail_url:
            sourceLink?.thumbnail_url ?? 'https://cdn.example.com/source/tokyo-food.jpg',
        },
        candidates: mockDb.candidates,
      });
    },
  },
  {
    method: 'PATCH',
    path: '/candidates/:candidateId',
    resolve: ({ body, params }) => {
      const patch = (body ?? {}) as { status?: string };
      const candidate = mockDb.candidates.find((item) => item.candidate_id === params.candidateId);

      if (candidate && patch.status) {
        candidate.status = patch.status as typeof candidate.status;
      }

      return json(candidate ?? mockDb.candidates[0]);
    },
  },
  {
    method: 'POST',
    path: '/candidates/batch',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as {
        candidates?: { candidate_id: string; status: 'accepted' | 'rejected' }[];
      };

      const updated = (payload.candidates ?? []).flatMap((item) => {
        const candidate = mockDb.candidates.find(
          (current) => current.candidate_id === item.candidate_id,
        );

        if (!candidate) {
          return [];
        }

        candidate.status = item.status;
        return [{ candidate_id: candidate.candidate_id, status: candidate.status }];
      });

      return json({ updated, failed: [] });
    },
  },
  { method: 'GET', path: '/places/search', resolve: () => json({ results: mockDb.places }) },
  {
    method: 'GET',
    path: '/places/similar',
    resolve: () =>
      json({
        results: mockDb.places.map((place) => ({ ...place, similarity_score: 0.91 })),
      }),
  },
  {
    method: 'GET',
    path: '/discover',
    resolve: () =>
      json({
        results: mockDb.places.map((place) => ({ ...place, similarity_score: 0.87 })),
      }),
  },
  {
    method: 'GET',
    path: '/places/:placeId',
    resolve: ({ params }) => {
      const place =
        mockDb.places.find((item) => item.place_id === params.placeId) ?? mockDb.places[0];

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
    resolve: () => json(page(mockDb.reviews)),
  },
  {
    method: 'POST',
    path: '/places/:placeId/reviews',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as { content?: string; rating?: number };
      const review = {
        review_id: nextMockId('review'),
        author: {
          user_id: mockDb.user.id,
          nickname: mockDb.user.nickname,
          avatar_url: mockDb.user.avatar_url,
        },
        rating: payload.rating ?? 5,
        content: payload.content ?? '',
        created_at: new Date().toISOString(),
      };

      mockDb.reviews.unshift(review);

      return json(review, 201);
    },
  },
  {
    method: 'DELETE',
    path: '/places/:placeId/reviews/:reviewId',
    resolve: ({ params }) => {
      mockDb.reviews = mockDb.reviews.filter((review) => review.review_id !== params.reviewId);
      return empty();
    },
  },
  {
    method: 'GET',
    path: '/places/:placeId/source-links',
    resolve: () => json({ items: mockDb.placeSourceLinks }),
  },
  {
    method: 'GET',
    path: '/collections',
    resolve: () =>
      json({
        items: mockDb.collections.map(({ placeIds: _placeIds, ...collection }) => ({
          ...collection,
          place_count: _placeIds.length,
        })),
      }),
  },
  {
    method: 'POST',
    path: '/collections',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as { icon?: string; name?: string };
      const collection = {
        collection_id: nextMockId('collection'),
        icon: payload.icon ?? null,
        is_default: false,
        name: payload.name ?? '새 플레이스',
        place_count: 0,
        placeIds: [] as string[],
        visibility: 'private' as const,
      };

      mockDb.collections.push(collection);

      return json(collection, 201);
    },
  },
  {
    method: 'PATCH',
    path: '/collections/:collectionId',
    resolve: ({ body, params }) => {
      const patch = (body ?? {}) as Record<string, unknown>;
      const collection = mockDb.collections.find(
        (item) => item.collection_id === params.collectionId,
      );

      if (!collection) {
        return json(
          { error: { code: 'COLLECTION_NOT_FOUND', message: '플레이스를 찾을 수 없습니다.' } },
          404,
        );
      }

      Object.assign(collection, patch);

      return json(collection);
    },
  },
  {
    method: 'DELETE',
    path: '/collections/:collectionId',
    resolve: ({ params }) => {
      mockDb.collections = mockDb.collections.filter(
        (collection) => collection.collection_id !== params.collectionId,
      );
      return empty();
    },
  },
  {
    method: 'GET',
    path: '/collections/:collectionId/places',
    resolve: ({ params }) => {
      const collection =
        mockDb.collections.find((item) => item.collection_id === params.collectionId) ??
        mockDb.collections[0]!;

      return json({
        collection_id: collection.collection_id,
        name: collection.name,
        visibility: collection.visibility,
        places: mockDb.places.filter((place) => collection.placeIds.includes(place.place_id)),
      });
    },
  },
  {
    method: 'POST',
    path: '/collections/:collectionId/places',
    resolve: ({ body, params }) => {
      const payload = (body ?? {}) as { place_id?: string };
      const collection = mockDb.collections.find(
        (item) => item.collection_id === params.collectionId,
      );

      if (collection && payload.place_id && !collection.placeIds.includes(payload.place_id)) {
        collection.placeIds.push(payload.place_id);
      }

      return empty(201);
    },
  },
  {
    method: 'DELETE',
    path: '/collections/:collectionId/places/:placeId',
    resolve: ({ params }) => {
      const collection = mockDb.collections.find(
        (item) => item.collection_id === params.collectionId,
      );

      if (collection) {
        collection.placeIds = collection.placeIds.filter((placeId) => placeId !== params.placeId);
      }

      return empty();
    },
  },
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
    resolve: () => json(page(mockDb.itineraries.map(toItineraryListItem))),
  },
  {
    method: 'POST',
    path: '/itineraries',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as Record<string, unknown>;
      const itinerary = {
        itinerary_id: nextMockId('itinerary'),
        title: String(payload.title ?? '새 플랜'),
        destination_region: String(payload.destination_region ?? '미정'),
        start_date: String(payload.start_date ?? '2026-07-01'),
        end_date: String(payload.end_date ?? '2026-07-02'),
        party_size: Number(payload.party_size ?? 1),
        visibility: 'private' as const,
        status: 'draft' as const,
        items: [],
      };

      mockDb.itineraries.unshift(itinerary);

      return json(itinerary, 201);
    },
  },
  {
    method: 'GET',
    path: '/itineraries/:itineraryId',
    resolve: ({ params }) => {
      const itinerary = mockDb.itineraries.find((item) => item.itinerary_id === params.itineraryId);

      return itinerary
        ? json(itinerary)
        : json(
            { error: { code: 'ITINERARY_NOT_FOUND', message: '플랜을 찾을 수 없습니다.' } },
            404,
          );
    },
  },
  {
    method: 'PATCH',
    path: '/itineraries/:itineraryId',
    resolve: ({ body, params }) => {
      const patch = (body ?? {}) as Record<string, unknown>;
      const itinerary = mockDb.itineraries.find((item) => item.itinerary_id === params.itineraryId);

      if (!itinerary) {
        return json(
          { error: { code: 'ITINERARY_NOT_FOUND', message: '플랜을 찾을 수 없습니다.' } },
          404,
        );
      }

      Object.assign(itinerary, patch);

      return json(itinerary);
    },
  },
  {
    method: 'DELETE',
    path: '/itineraries/:itineraryId',
    resolve: ({ params }) => {
      mockDb.itineraries = mockDb.itineraries.filter(
        (itinerary) => itinerary.itinerary_id !== params.itineraryId,
      );
      return empty();
    },
  },
  {
    method: 'POST',
    path: '/itineraries/:itineraryId/items',
    resolve: ({ body, params }) => {
      const payload = (body ?? {}) as {
        day_index?: number;
        place_id?: string;
        planned_duration_minutes?: number;
        sort_order?: number;
      };
      const itinerary = mockDb.itineraries.find((item) => item.itinerary_id === params.itineraryId);
      const item = toItineraryItem(payload.place_id ?? mockDb.places[0]!.place_id, payload);

      itinerary?.items.push(item);

      return json(item, 201);
    },
  },
  {
    method: 'PATCH',
    path: '/itineraries/:itineraryId/items/:itemId',
    resolve: ({ body, params }) => {
      const patch = (body ?? {}) as Record<string, unknown>;
      const itinerary = mockDb.itineraries.find((item) => item.itinerary_id === params.itineraryId);
      const item = itinerary?.items.find((current) => current.item_id === params.itemId);

      if (!item) {
        return json(
          { error: { code: 'ITEM_NOT_FOUND', message: '일정 장소를 찾을 수 없습니다.' } },
          404,
        );
      }

      Object.assign(item, patch);

      return json(item);
    },
  },
  {
    method: 'DELETE',
    path: '/itineraries/:itineraryId/items/:itemId',
    resolve: ({ params }) => {
      const itinerary = mockDb.itineraries.find((item) => item.itinerary_id === params.itineraryId);

      if (itinerary) {
        itinerary.items = itinerary.items.filter((item) => item.item_id !== params.itemId);
      }

      return empty();
    },
  },
  {
    method: 'POST',
    path: '/itineraries/:itineraryId/items/reorder',
    resolve: ({ body, params }) => {
      const payload = (body ?? {}) as {
        items?: { day_index: number; item_id: string; sort_order: number }[];
      };
      const itinerary = mockDb.itineraries.find((item) => item.itinerary_id === params.itineraryId);

      for (const patch of payload.items ?? []) {
        const item = itinerary?.items.find((current) => current.item_id === patch.item_id);

        if (item) {
          item.day_index = patch.day_index;
          item.sort_order = patch.sort_order;
        }
      }

      return empty(200);
    },
  },
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
    resolve: ({ params }) => {
      const feed = params.feed;

      if (feed === 'following') {
        return json(page([]));
      }

      return json(page(mockDb.communityPosts));
    },
  },
  {
    method: 'POST',
    path: '/community/posts',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as {
        content?: string;
        tagged_itinerary_id?: string;
        tagged_place_ids?: string[];
      };
      const taggedItinerary = payload.tagged_itinerary_id
        ? mockDb.itineraries.find((item) => item.itinerary_id === payload.tagged_itinerary_id)
        : null;
      const post = {
        post_id: nextMockId('post'),
        author: {
          user_id: mockDb.user.id,
          nickname: mockDb.user.nickname,
          avatar_url: mockDb.user.avatar_url,
        },
        content: payload.content ?? '',
        tagged_places: mockDb.places
          .filter((place) => payload.tagged_place_ids?.includes(place.place_id))
          .map((place) => ({
            place_id: place.place_id,
            canonical_name: place.canonical_name,
            category: place.category,
            thumbnail_url: place.thumbnail_url,
          })),
        tagged_itinerary: taggedItinerary
          ? { itinerary_id: taggedItinerary.itinerary_id, title: taggedItinerary.title }
          : null,
        like_count: 0,
        comment_count: 0,
        is_liked: false,
        created_at: new Date().toISOString(),
      };

      mockDb.communityPosts.unshift(post);

      return json(post, 201);
    },
  },
  {
    method: 'GET',
    path: '/community/posts/:postId',
    resolve: ({ params }) => {
      const post =
        mockDb.communityPosts.find((item) => item.post_id === params.postId) ??
        mockDb.communityPosts[0];

      return post
        ? json(post)
        : json({ error: { code: 'POST_NOT_FOUND', message: '포스트를 찾을 수 없습니다.' } }, 404);
    },
  },
  {
    method: 'DELETE',
    path: '/community/posts/:postId',
    resolve: ({ params }) => {
      mockDb.communityPosts = mockDb.communityPosts.filter(
        (post) => post.post_id !== params.postId,
      );
      return empty();
    },
  },
  {
    method: 'POST',
    path: '/community/posts/:postId/like',
    resolve: ({ params }) => {
      const postId = params.postId ?? '';
      const post = mockDb.communityPosts.find((item) => item.post_id === postId);

      if (post && !mockDb.likedPostIds.has(postId)) {
        mockDb.likedPostIds.add(postId);
        post.is_liked = true;
        post.like_count += 1;
      }

      return json({ like_count: post?.like_count ?? 0 }, 201);
    },
  },
  {
    method: 'DELETE',
    path: '/community/posts/:postId/like',
    resolve: ({ params }) => {
      const postId = params.postId ?? '';
      const post = mockDb.communityPosts.find((item) => item.post_id === postId);

      if (post && mockDb.likedPostIds.has(postId)) {
        mockDb.likedPostIds.delete(postId);
        post.is_liked = false;
        post.like_count = Math.max(0, post.like_count - 1);
      }

      return json({ like_count: post?.like_count ?? 0 });
    },
  },
  {
    method: 'GET',
    path: '/community/posts/:postId/comments',
    resolve: ({ params }) => json(page(mockDb.commentsByPostId[params.postId ?? ''] ?? [])),
  },
  {
    method: 'POST',
    path: '/community/posts/:postId/comments',
    resolve: ({ body, params }) => {
      const payload = (body ?? {}) as { content?: string };
      const comment = {
        comment_id: nextMockId('comment'),
        author: {
          user_id: mockDb.user.id,
          nickname: mockDb.user.nickname,
          avatar_url: mockDb.user.avatar_url,
        },
        content: payload.content ?? '',
        created_at: new Date().toISOString(),
      };
      const post = mockDb.communityPosts.find((item) => item.post_id === params.postId);
      const postComments = mockDb.commentsByPostId[params.postId ?? ''] ?? [];

      postComments.unshift(comment);
      mockDb.commentsByPostId[params.postId ?? ''] = postComments;

      if (post) {
        post.comment_count = postComments.length;
      }

      return json(comment, 201);
    },
  },
  {
    method: 'DELETE',
    path: '/community/posts/:postId/comments/:commentId',
    resolve: ({ params }) => {
      const postId = params.postId ?? '';
      const postComments = mockDb.commentsByPostId[postId] ?? [];
      const nextComments = postComments.filter(
        (comment) => comment.comment_id !== params.commentId,
      );
      const post = mockDb.communityPosts.find((item) => item.post_id === postId);

      mockDb.commentsByPostId[postId] = nextComments;

      if (post) {
        post.comment_count = nextComments.length;
      }

      return empty();
    },
  },
  {
    method: 'GET',
    path: '/users/:userId/profile',
    resolve: ({ params }) => {
      const userId = params.userId ?? '';

      return json({
        user_id: userId,
        nickname: mockDb.user.nickname,
        avatar_url: mockDb.user.avatar_url,
        follower_count: 42,
        following_count: 18,
        post_count: mockDb.communityPosts.length,
        is_following: mockDb.follows.has(userId),
      });
    },
  },
  {
    method: 'POST',
    path: '/users/:userId/follow',
    resolve: ({ params }) => {
      mockDb.follows.add(params.userId ?? '');
      return empty(201);
    },
  },
  {
    method: 'DELETE',
    path: '/users/:userId/follow',
    resolve: ({ params }) => {
      mockDb.follows.delete(params.userId ?? '');
      return empty();
    },
  },
  {
    method: 'GET',
    path: '/market/plans',
    resolve: () => json(page(mockDb.marketPlanList)),
  },
  {
    method: 'POST',
    path: '/market/plans',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as {
        cons?: string;
        description?: string;
        highlight?: string;
        itinerary_id?: string;
        pros?: string;
        tips?: string;
        title?: string;
      };
      const itinerary =
        mockDb.itineraries.find((item) => item.itinerary_id === payload.itinerary_id) ??
        mockDb.itineraries[0]!;
      const marketPlanId = nextMockId('market-plan');
      const author = {
        user_id: mockDb.user.id,
        nickname: mockDb.user.nickname,
        avatar_url: mockDb.user.avatar_url,
      };
      const groupedItems = itinerary.items.reduce<Record<number, typeof itinerary.items>>(
        (acc, item) => {
          const dayIndex = item.day_index ?? 0;
          acc[dayIndex] = [...(acc[dayIndex] ?? []), item];
          return acc;
        },
        {},
      );
      const days = Object.entries(groupedItems).map(([dayIndex, items]) => ({
        day_index: Number(dayIndex),
        items: items.map((item, index) => {
          const place =
            mockDb.places.find((current) => current.place_id === item.place_id) ??
            mockDb.places[0]!;

          return {
            ...place,
            thumbnail_url: place.thumbnail_url,
            planned_duration_minutes: item.planned_duration_minutes ?? 90,
            sort_order: item.sort_order ?? index + 1,
          };
        }),
      }));
      const detail = {
        market_plan_id: marketPlanId,
        title: payload.title ?? itinerary.title,
        destination_region: itinerary.destination_region,
        duration_nights: 3,
        party_size: itinerary.party_size,
        credit_price: 1,
        author,
        description: payload.description ?? '',
        highlight: payload.highlight ?? '',
        pros: payload.pros ?? '',
        cons: payload.cons ?? '',
        tips: payload.tips,
        days,
        ota_booking_info: { booked_at: '2026-05-01', verified: true },
        view_count: 0,
        created_at: new Date().toISOString(),
      };

      mockDb.marketPlanDetails.unshift(detail);
      mockDb.marketPlanList.unshift({
        market_plan_id: detail.market_plan_id,
        title: detail.title,
        destination_region: detail.destination_region,
        duration_nights: detail.duration_nights,
        party_size: detail.party_size,
        credit_price: detail.credit_price,
        author,
        cover_thumbnail_url: detail.days[0]?.items[0]?.thumbnail_url ?? '',
        highlight: detail.highlight,
        place_count: itinerary.items.length,
        view_count: detail.view_count,
        is_ota_verified: detail.ota_booking_info.verified,
        created_at: detail.created_at,
      });

      return json(detail, 201);
    },
  },
  {
    method: 'GET',
    path: '/market/plans/:marketPlanId/preview',
    resolve: ({ params }) => {
      const detail =
        mockDb.marketPlanDetails.find((item) => item.market_plan_id === params.marketPlanId) ??
        mockDb.marketPlanDetails[0];
      const listItem = mockDb.marketPlanList.find(
        (item) => item.market_plan_id === detail?.market_plan_id,
      );
      const places = detail?.days.flatMap((day) => day.items) ?? [];

      return detail && listItem
        ? json({
            market_plan_id: detail.market_plan_id,
            title: detail.title,
            destination_region: detail.destination_region,
            duration_nights: detail.duration_nights,
            party_size: detail.party_size,
            credit_price: listItem.credit_price,
            author: detail.author,
            description: detail.description,
            highlight: detail.highlight,
            preview_places: places.slice(0, 1).map((place) => ({
              place_id: place.place_id,
              canonical_name: place.canonical_name,
              category: place.category,
              thumbnail_url: place.thumbnail_url,
            })),
            hidden_place_count: Math.max(0, places.length - 1),
            view_count: detail.view_count,
            is_purchased: false,
          })
        : json(
            { error: { code: 'MARKET_PLAN_NOT_FOUND', message: '판매 플랜을 찾을 수 없습니다.' } },
            404,
          );
    },
  },
  {
    method: 'GET',
    path: '/market/plans/:marketPlanId',
    resolve: ({ params }) => {
      const detail =
        mockDb.marketPlanDetails.find((item) => item.market_plan_id === params.marketPlanId) ??
        mockDb.marketPlanDetails[0];

      if (!detail) {
        return json(
          { error: { code: 'MARKET_PLAN_NOT_FOUND', message: '판매 플랜을 찾을 수 없습니다.' } },
          404,
        );
      }

      detail.view_count += 1;

      return json(detail);
    },
  },
  {
    method: 'DELETE',
    path: '/market/plans/:marketPlanId',
    resolve: ({ params }) => {
      mockDb.marketPlanList = mockDb.marketPlanList.filter(
        (item) => item.market_plan_id !== params.marketPlanId,
      );
      mockDb.marketPlanDetails = mockDb.marketPlanDetails.filter(
        (item) => item.market_plan_id !== params.marketPlanId,
      );

      return empty();
    },
  },
  {
    method: 'GET',
    path: '/credits/me',
    resolve: () =>
      json({
        balance: mockDb.creditBalance,
        lifetime_earned: mockDb.creditHistories
          .filter((history) => history.amount > 0)
          .reduce((sum, history) => sum + history.amount, 0),
        lifetime_spent: Math.abs(
          mockDb.creditHistories
            .filter((history) => history.amount < 0)
            .reduce((sum, history) => sum + history.amount, 0),
        ),
      }),
  },
  {
    method: 'GET',
    path: '/credits/me/history',
    resolve: () => json(page(mockDb.creditHistories)),
  },
  {
    method: 'POST',
    path: '/credits/ads/start',
    resolve: () => {
      const adSession = {
        ad_session_id: nextMockId('ad-session'),
        ad_url: 'https://ads.example.com/watch?token=mock',
        expires_at: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        viewed_today: 2,
        required_for_credit: 5,
        is_completed: false,
      };

      mockDb.adSessions.push(adSession);

      return json(adSession, 201);
    },
  },
  {
    method: 'POST',
    path: '/credits/ads/complete',
    resolve: ({ body }) => {
      const payload = (body ?? {}) as { ad_session_id?: string };
      const session =
        mockDb.adSessions.find((item) => item.ad_session_id === payload.ad_session_id) ??
        mockDb.adSessions[0];
      const viewedToday = (session?.viewed_today ?? 2) + 1;
      const creditEarned = viewedToday >= (session?.required_for_credit ?? 5);

      if (session) {
        session.viewed_today = viewedToday;
        session.is_completed = true;
      }

      if (creditEarned) {
        mockDb.creditBalance += 1;
        mockDb.creditHistories.unshift({
          history_id: nextMockId('credit-history'),
          credit_type: 'ad_view',
          amount: 1,
          balance_after: mockDb.creditBalance,
          description: '광고 시청 적립',
          created_at: new Date().toISOString(),
        });
      }

      return json({
        viewed_today: viewedToday,
        required_for_credit: session?.required_for_credit ?? 5,
        credit_earned: creditEarned,
        balance: mockDb.creditBalance,
      });
    },
  },
  {
    method: 'GET',
    path: '/notifications',
    resolve: () => json(page(mockDb.notifications)),
  },
  {
    method: 'PATCH',
    path: '/notifications/:notificationId/read',
    resolve: ({ params }) => {
      const notification = mockDb.notifications.find(
        (item) => item.notification_id === params.notificationId,
      );

      if (notification) {
        notification.is_read = true;
      }

      return json({
        notification_id: params.notificationId,
        is_read: true,
      });
    },
  },
  {
    method: 'GET',
    path: '/public/itineraries/:shareToken',
    resolve: () => json(mockDb.itineraries[0]),
  },
  {
    method: 'GET',
    path: '/public/collections/:shareToken',
    resolve: () => {
      const collection = mockDb.collections[0]!;

      return json({
        collection_id: collection.collection_id,
        name: collection.name,
        visibility: 'public',
        places: mockDb.places.filter((place) => collection.placeIds.includes(place.place_id)),
      });
    },
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
