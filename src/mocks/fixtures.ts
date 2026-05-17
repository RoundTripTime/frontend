import type { AuthUser } from '@/src/api/auth/types';

export const mockUser: AuthUser = {
  id: 'mock-user-1',
  nickname: '하승민 8237',
  avatar_url: 'https://cdn.example.com/avatars/fox.png',
  email: 'mock@example.com',
  locale: 'ko-KR',
  is_new_user: false,
  credit_balance: 3,
};

export const mockAccessToken = 'mock-header.eyJleHAiOjQxMDI0NDQ4MDB9.mock-signature';
export const mockRefreshToken = 'mock-refresh-token';

export const mockPlaces = [
  {
    place_id: 'tokyo-cafe',
    canonical_name: '도쿄 감성 카페',
    latitude: 35.659513,
    longitude: 139.70044,
    category: '카페',
    country_code: 'JP',
    google_place_id: 'google-tokyo-cafe',
    kakao_place_id: 'kakao-tokyo-cafe',
    thumbnail_url: 'https://cdn.example.com/places/tokyo-cafe.jpg',
    thumbnail_source: 'flickr',
    source_link: {
      url: 'https://example.com/tokyo-food',
      title: '도쿄 맛집 VLOG',
      thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
      platform: 'youtube_short',
    },
    evidence: '영상에서 장소명이 언급된 구간과 지도 정보를 기준으로 추출됨',
    created_at: '2026-05-16T00:00:00Z',
  },
  {
    place_id: 'seoul-bistro',
    canonical_name: '성수 비스트로',
    latitude: 37.5446,
    longitude: 127.0557,
    category: '맛집',
    country_code: 'KR',
    google_place_id: 'google-seoul-bistro',
    kakao_place_id: 'kakao-seoul-bistro',
    thumbnail_url: 'https://cdn.example.com/places/seoul-bistro.jpg',
    thumbnail_source: 'wikimedia',
    source_link: {
      url: 'https://example.com/seoul-food',
      title: '성수 맛집 리스트',
      thumbnail_url: 'https://cdn.example.com/source/seoul-food.jpg',
      platform: 'instagram_reel',
    },
    evidence: '본문과 태그에서 장소명이 확인됨',
    created_at: '2026-05-16T00:00:00Z',
  },
];

export const mockItineraries = [
  {
    itinerary_id: 'draft-plan',
    title: '도쿄 여름 여행',
    destination_region: '도쿄, 일본',
    start_date: '2026-07-01',
    end_date: '2026-07-04',
    party_size: 2,
    visibility: 'private',
    status: 'draft',
    place_count: 3,
    created_at: '2026-05-16T00:00:00Z',
  },
];
