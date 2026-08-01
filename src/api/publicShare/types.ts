import type { CollectionPlacesResponse } from '../collections/types';
import type { ID, ISODate, Visibility } from '../common';
import type { ItineraryItem } from '../itineraries/types';

export type PublicItinerary = {
  itinerary_id: ID;
  title: string;
  destination_region: string;
  start_date: ISODate;
  end_date: ISODate;
  party_size: number;
  items: ItineraryItem[];
};

export type PublicCollection = CollectionPlacesResponse & {
  visibility: Visibility;
};
