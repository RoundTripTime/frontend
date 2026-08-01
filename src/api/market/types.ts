import type { ID, ISODate, ISODateTime, PaginatedResponse } from '../common';
import type { CommunityAuthor } from '../community/types';
import type { PlaceSummary } from '../places/types';

export type MarketPlanListItem = {
  market_plan_id: ID;
  title: string;
  destination_region: string;
  duration_nights: number;
  party_size: number;
  credit_price: number;
  author: CommunityAuthor;
  cover_thumbnail_url: string;
  highlight: string;
  place_count: number;
  view_count: number;
  is_ota_verified: boolean;
  created_at: ISODateTime;
};

export type MarketPlansResponse = PaginatedResponse<MarketPlanListItem>;

export type MarketPlanPreview = {
  market_plan_id: ID;
  title: string;
  destination_region: string;
  duration_nights: number;
  party_size: number;
  credit_price: number;
  author: CommunityAuthor;
  description: string;
  highlight: string;
  preview_places: Pick<
    PlaceSummary,
    'place_id' | 'canonical_name' | 'category' | 'thumbnail_url'
  >[];
  hidden_place_count: number;
  view_count: number;
  is_purchased: boolean;
};

export type MarketPlan = Omit<
  MarketPlanPreview,
  'credit_price' | 'preview_places' | 'hidden_place_count' | 'is_purchased'
> & {
  pros: string;
  cons: string;
  tips?: string;
  days: {
    day_index: number;
    items: (PlaceSummary & {
      thumbnail_url: string;
      planned_duration_minutes: number | null;
      sort_order: number;
    })[];
  }[];
  ota_booking_info: {
    booked_at: ISODate;
    verified: boolean;
  };
  created_at: ISODateTime;
};

export type CreateMarketPlanRequest = {
  itinerary_id: ID;
  title: string;
  description: string;
  highlight: string;
  pros: string;
  cons: string;
  tips?: string;
};
