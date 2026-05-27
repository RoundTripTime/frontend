import type { Itinerary, ItineraryItem, ItineraryListItem } from '@/src/api/itineraries/types';

export type PlanListItemViewModel = {
  id: string;
  title: string;
  destinationLabel: string;
  dateRangeLabel: string;
  partyLabel: string;
  placeCountLabel: string;
  isPrivate: boolean;
};

export type PlanPlaceViewModel = {
  itemId: string;
  placeId: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  dayIndex: number | null;
  dayLabel: string;
  sortOrder: number | null;
  durationLabel: string;
  markerTone: 'day' | 'unassigned';
};

export type PlanDayViewModel = {
  dayIndex: number;
  title: string;
  items: PlanPlaceViewModel[];
};

export type PlanDetailViewModel = {
  id: string;
  title: string;
  meta: string;
  dateRangeLabel: string;
  partyLabel: string;
  placeCount: number;
  days: PlanDayViewModel[];
  unassignedItems: PlanPlaceViewModel[];
  allItems: PlanPlaceViewModel[];
};

export type PlanMapViewModel = Pick<
  PlanDetailViewModel,
  'id' | 'title' | 'days' | 'unassignedItems' | 'allItems'
> & {
  markers: PlanPlaceViewModel[];
};

function formatDateRange(startDate: string, endDate: string) {
  return `${startDate.replaceAll('-', '.')} ~ ${endDate.replaceAll('-', '.')}`;
}

function formatDuration(minutes: number | null) {
  if (!minutes) {
    return '체류 시간 미정';
  }

  return `예상 체류 ${minutes}분`;
}

function sortItems(a: PlanPlaceViewModel, b: PlanPlaceViewModel) {
  return (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER);
}

function toPlanPlaceViewModel(item: ItineraryItem): PlanPlaceViewModel {
  return {
    itemId: item.item_id,
    placeId: item.place_id,
    name: item.place_name,
    category: '장소',
    latitude: item.latitude,
    longitude: item.longitude,
    dayIndex: item.day_index,
    dayLabel: item.day_index ? `Day ${item.day_index}` : '미배치',
    sortOrder: item.sort_order,
    durationLabel: formatDuration(item.planned_duration_minutes),
    markerTone: item.day_index ? 'day' : 'unassigned',
  };
}

export function createPlanListItemViewModel(plan: ItineraryListItem): PlanListItemViewModel {
  return {
    dateRangeLabel: formatDateRange(plan.start_date, plan.end_date),
    destinationLabel: plan.destination_region,
    id: plan.itinerary_id,
    isPrivate: plan.visibility === 'private',
    partyLabel: `${plan.party_size}명`,
    placeCountLabel: `장소 ${plan.place_count}개`,
    title: plan.title,
  };
}

export function createPlanDetailViewModel(itinerary: Itinerary): PlanDetailViewModel {
  const allItems = itinerary.items.map(toPlanPlaceViewModel);
  const assignedItems = allItems.filter((item) => item.dayIndex !== null);
  const unassignedItems = allItems.filter((item) => item.dayIndex === null).sort(sortItems);
  const dayIndexes = [...new Set(assignedItems.map((item) => item.dayIndex).filter(Boolean))]
    .map(Number)
    .sort((a, b) => a - b);

  return {
    id: itinerary.itinerary_id,
    title: itinerary.title,
    meta: `${itinerary.destination_region} · ${formatDateRange(
      itinerary.start_date,
      itinerary.end_date,
    )} · ${itinerary.party_size}명`,
    dateRangeLabel: formatDateRange(itinerary.start_date, itinerary.end_date),
    partyLabel: `${itinerary.party_size}명`,
    placeCount: allItems.length,
    days: dayIndexes.map((dayIndex) => ({
      dayIndex,
      title: `Day ${dayIndex}`,
      items: assignedItems.filter((item) => item.dayIndex === dayIndex).sort(sortItems),
    })),
    unassignedItems,
    allItems,
  };
}

export function createPlanMapViewModel(itinerary: Itinerary): PlanMapViewModel {
  const detail = createPlanDetailViewModel(itinerary);

  return {
    id: detail.id,
    title: detail.title,
    days: detail.days,
    unassignedItems: detail.unassignedItems,
    allItems: detail.allItems,
    markers: detail.allItems,
  };
}
