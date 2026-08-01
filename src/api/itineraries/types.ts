import type { ID, ISODate, ISODateTime, PaginatedResponse, Visibility } from '../common';
import type { PlaceSummary } from '../places/types';

export type ItineraryStatus = 'draft' | 'confirmed' | 'completed';
export type OtaType = 'accommodation' | 'flight' | 'activity';

export type ItineraryListItem = {
  itinerary_id: ID;
  title: string;
  destination_region: string;
  start_date: ISODate;
  end_date: ISODate;
  party_size: number;
  visibility: Visibility;
  status: ItineraryStatus;
  place_count: number;
  created_at: ISODateTime;
};

export type ItinerariesResponse = PaginatedResponse<ItineraryListItem>;

export type ItineraryItem = {
  item_id: ID;
  place_id: ID;
  place_name: string;
  latitude: number;
  longitude: number;
  day_index: number | null;
  sort_order: number | null;
  start_time: string | null;
  end_time: string | null;
  planned_duration_minutes: number | null;
};

export type Itinerary = Omit<ItineraryListItem, 'place_count' | 'created_at'> & {
  items: ItineraryItem[];
};

export type CreateItineraryRequest = Pick<
  Itinerary,
  'title' | 'destination_region' | 'start_date' | 'end_date' | 'party_size'
>;

export type UpdateItineraryRequest = Partial<
  Pick<
    Itinerary,
    | 'title'
    | 'destination_region'
    | 'start_date'
    | 'end_date'
    | 'party_size'
    | 'visibility'
    | 'status'
  >
>;

export type CreateItineraryItemRequest = {
  place_id: ID;
  day_index?: number;
  end_time?: string | null;
  sort_order?: number;
  start_time?: string | null;
};

export type UpdateItineraryItemRequest = {
  day_index?: number | null;
  end_time?: string | null;
  sort_order?: number | null;
  start_time?: string | null;
};

export type ReorderItineraryItemsRequest = {
  items: {
    item_id: ID;
    day_index: number;
    sort_order: number;
  }[];
};

export type OtaLinksResponse = {
  ota_url: string;
};

export type AgentMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type SendAgentMessageRequest = {
  message: string;
  history?: AgentMessage[];
};

export type AgentToolResult = {
  tool: string;
  places?: PlaceSummary[];
};

export type SendAgentMessageResponse = {
  reply: string;
  tool_results: AgentToolResult[];
  itinerary_updated: boolean;
};
