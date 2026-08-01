import type { ID, Visibility } from '../common';
import type { PlaceSummary } from '../places/types';

export type Collection = {
  collection_id: ID;
  name: string;
  is_default: boolean;
  icon: string | null;
  place_count: number;
  visibility: Visibility;
};

export type CollectionsResponse = {
  items: Collection[];
};

export type CreateCollectionRequest = {
  name: string;
  icon?: string;
};

export type UpdateCollectionRequest = Partial<Pick<Collection, 'name' | 'icon' | 'visibility'>>;

export type CollectionPlacesResponse = {
  collection_id: ID;
  name: string;
  visibility: Visibility;
  places: PlaceSummary[];
};

export type AddCollectionPlaceRequest = {
  place_id: ID;
};

export type ShareLinkResponse = {
  share_url: string;
  visibility: Visibility;
};
