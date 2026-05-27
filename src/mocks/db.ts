import {
  mockAccessToken,
  mockItineraryDetail,
  mockItineraries,
  mockPlaces,
  mockRefreshToken,
  mockUser,
} from '@/src/mocks/fixtures';

import type { PlaceCandidate } from '@/src/api/candidates/types';
import type { Collection } from '@/src/api/collections/types';
import type { CommunityComment, CommunityPost } from '@/src/api/community/types';
import type { Itinerary, ItineraryItem, ItineraryListItem } from '@/src/api/itineraries/types';
import type { MarketPlan, MarketPlanListItem } from '@/src/api/market/types';
import type { Notification } from '@/src/api/notifications/types';
import type { PlaceDetail, PlaceReview, PlaceSourceLink } from '@/src/api/places/types';
import type { SourceLink } from '@/src/api/sourceLinks/types';
import type { UserProfile } from '@/src/api/users/types';

type ExtractionJob = {
  job_id: string;
  source_link_id: string;
  job_status: 'pending' | 'processing' | 'done' | 'failed';
  signal_count: number;
  error_code: string | null;
  started_at: string;
  completed_at: string | null;
};

type CollectionRecord = Collection & {
  placeIds: string[];
};

type CreditHistory = {
  history_id: string;
  credit_type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
};

type AdSession = {
  ad_session_id: string;
  ad_url: string;
  expires_at: string;
  viewed_today: number;
  required_for_credit: number;
  is_completed: boolean;
};

const counters: Record<string, number> = {};

export function nextMockId(prefix: string) {
  counters[prefix] = (counters[prefix] ?? 0) + 1;
  return `${prefix}-${counters[prefix]}`;
}

export function page<T>(items: T[]) {
  return {
    items,
    next_cursor: null,
  };
}

export function getSourceType(url: string) {
  if (url.includes('instagram.com')) {
    return 'instagram_reel';
  }

  return 'youtube_short';
}

export function toItineraryListItem(itinerary: Itinerary): ItineraryListItem {
  return {
    itinerary_id: itinerary.itinerary_id,
    title: itinerary.title,
    destination_region: itinerary.destination_region,
    start_date: itinerary.start_date,
    end_date: itinerary.end_date,
    party_size: itinerary.party_size,
    visibility: itinerary.visibility,
    status: itinerary.status,
    place_count: itinerary.items.length,
    created_at: '2026-05-16T00:00:00Z',
  };
}

export function toItineraryItem(
  placeId: string,
  patch: Partial<ItineraryItem> = {},
): ItineraryItem {
  const place = mockPlaces.find((item) => item.place_id === placeId) ?? mockPlaces[0]!;

  return {
    item_id: nextMockId('itinerary-item'),
    place_id: place.place_id,
    place_name: place.canonical_name,
    latitude: place.latitude,
    longitude: place.longitude,
    day_index: patch.day_index ?? null,
    sort_order: patch.sort_order ?? null,
    planned_duration_minutes: patch.planned_duration_minutes ?? null,
  };
}

const currentUser: UserProfile = {
  ...mockUser,
  home_region: '서울',
  map_provider: 'kakao',
  created_at: '2026-05-16T00:00:00Z',
};

const currentAuthor = {
  user_id: currentUser.id,
  nickname: currentUser.nickname,
  avatar_url: currentUser.avatar_url,
};

const sourceLinks: SourceLink[] = [
  {
    source_link_id: 'mock-source-link',
    url: 'https://example.com/tokyo-food',
    source_type: 'youtube_short',
    title: '도쿄 맛집 VLOG',
    thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
    job_status: 'done',
    submitted_at: '2026-05-16T00:00:00Z',
  },
];

const jobs: ExtractionJob[] = [
  {
    job_id: 'mock-job',
    source_link_id: 'mock-source-link',
    job_status: 'done',
    signal_count: 3,
    error_code: null,
    started_at: '2026-05-16T00:00:00Z',
    completed_at: '2026-05-16T00:00:02Z',
  },
];

const candidates: PlaceCandidate[] = mockPlaces.map((place, index) => ({
  candidate_id: `mock-candidate-${index + 1}`,
  candidate_name: place.canonical_name,
  category: place.category,
  confidence_score: 0.92,
  evidence: place.evidence,
  place,
  rank_order: index + 1,
  requires_confirmation: false,
  status: 'proposed',
}));

const collections: CollectionRecord[] = [
  {
    collection_id: 'default',
    icon: null,
    is_default: true,
    name: '저장한 플레이스',
    place_count: mockPlaces.length,
    placeIds: mockPlaces.map((place) => place.place_id),
    visibility: 'private',
  },
];

const itineraries: Itinerary[] = [
  mockItineraryDetail,
  {
    ...mockItineraries[1]!,
    items: [toItineraryItem('seoul-bistro', { day_index: 1, sort_order: 1 })],
  },
];

const communityPosts: CommunityPost[] = [
  {
    post_id: 'sample-post',
    author: currentAuthor,
    content: '도쿄 3박 4일 동선이 좋아서 공유합니다.',
    tagged_places: [mockPlaces[0]!],
    tagged_itinerary: { itinerary_id: 'draft-plan', title: '도쿄 여름 여행' },
    like_count: 24,
    comment_count: 1,
    is_liked: false,
    created_at: '2026-05-16T00:00:00Z',
  },
];

const comments: CommunityComment[] = [
  {
    comment_id: 'mock-comment-1',
    author: currentAuthor,
    content: '동선 참고할게요.',
    created_at: '2026-05-16T00:00:00Z',
  },
];

const reviews: PlaceReview[] = [
  {
    review_id: 'mock-review-1',
    author: currentAuthor,
    rating: 5,
    content: '저장해둔 장소라 다시 가보고 싶어요.',
    created_at: '2026-05-16T00:00:00Z',
  },
];

const placeSourceLinks: PlaceSourceLink[] = [
  {
    source_link_id: 'mock-source-link',
    url: 'https://example.com/tokyo-food',
    platform: 'youtube_short',
    title: '도쿄 맛집 VLOG',
    thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
    submitted_at: '2026-05-16T00:00:00Z',
  },
];

const marketPlanList: MarketPlanListItem[] = [
  {
    market_plan_id: 'sample-market-plan',
    title: '도쿄 3박 4일 완벽 코스',
    destination_region: '도쿄, 일본',
    duration_nights: 3,
    party_size: 2,
    credit_price: 1,
    author: currentAuthor,
    cover_thumbnail_url: 'https://cdn.example.com/places/tokyo-cafe.jpg',
    highlight: '현지인만 아는 골목 맛집 5곳 포함',
    place_count: mockItineraryDetail.items.length,
    view_count: 2341,
    is_ota_verified: true,
    created_at: '2026-05-16T00:00:00Z',
  },
];

const marketPlanDetails: MarketPlan[] = [
  {
    market_plan_id: 'sample-market-plan',
    title: '도쿄 3박 4일 완벽 코스',
    destination_region: '도쿄, 일본',
    duration_nights: 3,
    party_size: 2,
    author: currentAuthor,
    description: '실제로 다녀온 도쿄 여행 플랜이에요.',
    highlight: '시부야와 긴자를 모두 담은 알찬 일정',
    pros: '이동 동선이 짧아서 피로도가 낮았어요.',
    cons: '주말엔 혼잡해서 오전 이동이 좋아요.',
    tips: '교통카드를 미리 충전해두면 편해요.',
    days: [
      {
        day_index: 1,
        items: mockItineraryDetail.items
          .filter((item) => item.day_index === 1)
          .map((item) => {
            const place = mockPlaces.find((current) => current.place_id === item.place_id);

            return {
              ...(place ?? mockPlaces[0]!),
              place_id: item.place_id,
              canonical_name: place?.canonical_name ?? item.place_name,
              latitude: item.latitude,
              longitude: item.longitude,
              thumbnail_url:
                place?.thumbnail_url ?? 'https://cdn.example.com/places/placeholder.jpg',
              planned_duration_minutes: item.planned_duration_minutes ?? 90,
              sort_order: item.sort_order ?? 1,
            };
          }),
      },
    ],
    ota_booking_info: { booked_at: '2026-05-01', verified: true },
    view_count: 143,
    created_at: '2026-05-16T00:00:00Z',
  },
];

const creditHistories: CreditHistory[] = [
  {
    history_id: 'mock-credit-history-1',
    credit_type: 'ad_view',
    amount: 1,
    balance_after: 3,
    description: '광고 시청 적립',
    created_at: '2026-05-16T00:00:00Z',
  },
];

const notifications: Notification[] = [
  {
    notification_id: 'mock-notification-1',
    type: 'job_completed',
    job_id: 'mock-job',
    message: '새 장소 후보가 준비됐어요.',
    is_read: false,
    created_at: '2026-05-16T00:00:00Z',
  },
];

export const mockDb = {
  accessToken: mockAccessToken,
  adSessions: [] as AdSession[],
  candidates,
  collections,
  comments,
  communityPosts,
  creditBalance: 3,
  creditHistories,
  follows: new Set<string>(),
  itineraries,
  jobs,
  likedPostIds: new Set<string>(),
  marketPlanDetails,
  marketPlanList,
  notifications,
  placeSourceLinks,
  places: [...mockPlaces] as PlaceDetail[],
  refreshToken: mockRefreshToken,
  reviews,
  sourceLinks,
  user: currentUser,
};
