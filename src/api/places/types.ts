import type { ID, ISODateTime, PaginatedResponse } from '../common';

export type PlaceCategory = '관광명소' | '맛집' | '카페' | '숙박' | '자연' | '기타' | string;
export type ThumbnailSource = 'flickr' | 'wikimedia' | 'google_places' | string;

export type PlaceSummary = {
  id?: ID;
  place_id: ID;
  canonical_name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  country_code: string;
  thumbnail_url?: string;
  thumbnail_source?: ThumbnailSource;
};

export type PlaceDetail = PlaceSummary & {
  google_place_id: string;
  kakao_place_id: string;
  thumbnail_url: string;
  thumbnail_source: ThumbnailSource;
  source_link: {
    url: string;
    title: string;
    thumbnail_url: string;
    platform: string;
  };
  evidence: string;
  created_at: ISODateTime;
};

export type PlaceSearchResponse = {
  results: PlaceSummary[];
};

export type SimilarPlace = PlaceSummary & {
  thumbnail_url: string;
  thumbnail_source: ThumbnailSource;
  similarity_score: number;
};

export type SimilarPlacesResponse = {
  results: SimilarPlace[];
};

export type DiscoverResponse = {
  results: SimilarPlace[];
};

export type PlaceReview = {
  review_id: ID;
  author: {
    user_id: ID;
    nickname: string;
    avatar_url: string;
  };
  rating: number;
  content: string;
  created_at: ISODateTime;
};

export type PlaceReviewsResponse = PaginatedResponse<PlaceReview>;

export type CreatePlaceReviewRequest = {
  rating: number;
  content?: string;
};

export type PlaceSourceLink = {
  source_link_id: ID;
  url: string;
  platform: string;
  title: string;
  thumbnail_url: string;
  submitted_at: ISODateTime;
};

export type PlaceSourceLinksResponse = {
  items: PlaceSourceLink[];
};
