import type { PlaceCandidate } from '@/src/api/candidates/types';
import type { PlaceDetail, PlaceSummary } from '@/src/api/places/types';

export type PlaceCategoryFilterValue =
  | 'all'
  | 'attraction'
  | 'restaurant'
  | 'cafe'
  | 'accommodation'
  | 'nature'
  | 'etc';

export type PlaceCategoryFilterOption = {
  label: string;
  value: PlaceCategoryFilterValue;
};

export type PlaceCardViewModel = {
  id: string;
  name: string;
  category: string;
  categoryValue: PlaceCategoryFilterValue;
  countryLabel: string;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
  sourceThumbnailUrl?: string;
};

export type PlaceCandidateCardViewModel = {
  id: string;
  placeId: string;
  name: string;
  category: string;
  countryLabel: string;
  status: PlaceCandidate['status'];
  statusLabel: string;
  evidence: string;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
  sourceThumbnailUrl?: string;
};

export type ResolvedPlaceCandidate = PlaceCandidate & {
  place: NonNullable<PlaceCandidate['place']>;
};

export type PlaceDetailViewModel = {
  id: string;
  name: string;
  meta: string;
  latitude: number;
  longitude: number;
  kakaoPlaceId: string;
  googlePlaceId: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceLabel: string;
  thumbnailUrl?: string;
  sourceThumbnailUrl?: string;
  evidence: string;
};

const countryLabels: Record<string, string> = {
  JP: '일본',
  KR: '한국',
  TH: '태국',
  VN: '베트남',
};

const categoryLabels: Record<Exclude<PlaceCategoryFilterValue, 'all'>, string> = {
  accommodation: '숙박',
  attraction: '관광명소',
  cafe: '카페',
  etc: '기타',
  nature: '자연',
  restaurant: '맛집',
};

const categoryAliases: Record<string, PlaceCategoryFilterValue> = {
  accommodation: 'accommodation',
  attraction: 'attraction',
  cafe: 'cafe',
  etc: 'etc',
  nature: 'nature',
  restaurant: 'restaurant',
  관광명소: 'attraction',
  기타: 'etc',
  맛집: 'restaurant',
  숙박: 'accommodation',
  숙소: 'accommodation',
  자연: 'nature',
  카페: 'cafe',
};

export const placeCategoryFilterOptions = [
  { label: '전체', value: 'all' },
  { label: '관광명소', value: 'attraction' },
  { label: '맛집', value: 'restaurant' },
  { label: '카페', value: 'cafe' },
  { label: '숙박', value: 'accommodation' },
  { label: '자연', value: 'nature' },
  { label: '기타', value: 'etc' },
] as const satisfies readonly PlaceCategoryFilterOption[];

const candidateStatusLabels: Record<PlaceCandidate['status'], string> = {
  accepted: '수락됨',
  edited: '수정됨',
  proposed: '확인 대기',
  rejected: '거절됨',
};

function getCountryLabel(countryCode: string) {
  return countryLabels[countryCode] ?? countryCode;
}

function normalizeThumbnailUrl(url: string | null | undefined) {
  const trimmedUrl = url?.trim();
  return trimmedUrl ? trimmedUrl : undefined;
}

export function getPlaceThumbnailUrl(place: PlaceSummary) {
  return normalizeThumbnailUrl(place.thumbnail_url);
}

export function getPlaceSourceThumbnailUrl(place: PlaceSummary) {
  return normalizeThumbnailUrl(place.source_link?.thumbnail_url);
}

export function getPlaceCategoryValue(category: string): PlaceCategoryFilterValue {
  return categoryAliases[category] ?? 'etc';
}

export function getPlaceCategoryLabel(category: string) {
  const categoryValue = getPlaceCategoryValue(category);

  if (categoryValue === 'all') {
    return '전체';
  }

  return categoryLabels[categoryValue];
}

export function createPlaceCardViewModel(place: PlaceSummary): PlaceCardViewModel {
  const categoryValue = getPlaceCategoryValue(place.category);

  return {
    id: place.place_id,
    name: place.canonical_name,
    category: getPlaceCategoryLabel(place.category),
    categoryValue,
    countryLabel: getCountryLabel(place.country_code),
    latitude: place.latitude,
    longitude: place.longitude,
    thumbnailUrl: getPlaceThumbnailUrl(place),
    sourceThumbnailUrl: getPlaceSourceThumbnailUrl(place),
  };
}

export function getPlaceCountryLabel(countryCode: string) {
  return getCountryLabel(countryCode);
}

export function hasResolvedCandidatePlace(
  candidate: PlaceCandidate,
): candidate is ResolvedPlaceCandidate {
  return Boolean(candidate.place);
}

export function getPlaceCandidateId(candidate: PlaceCandidate) {
  return candidate.candidate_id ?? candidate.id ?? '';
}

export function getPlaceId(place: PlaceSummary) {
  return place.place_id ?? place.id ?? '';
}

export function createPlaceCandidateCardViewModel(
  candidate: ResolvedPlaceCandidate,
): PlaceCandidateCardViewModel {
  return {
    id: getPlaceCandidateId(candidate),
    placeId: getPlaceId(candidate.place),
    name: candidate.place.canonical_name,
    category: getPlaceCategoryLabel(candidate.category),
    countryLabel: getCountryLabel(candidate.place.country_code),
    status: candidate.status,
    statusLabel: candidateStatusLabels[candidate.status],
    evidence: candidate.evidence,
    latitude: candidate.place.latitude,
    longitude: candidate.place.longitude,
    thumbnailUrl: getPlaceThumbnailUrl(candidate.place),
    sourceThumbnailUrl: getPlaceSourceThumbnailUrl(candidate.place),
  };
}

export function createPlaceDetailViewModel(place: PlaceDetail): PlaceDetailViewModel {
  return {
    id: place.place_id,
    name: place.canonical_name,
    meta: `${getPlaceCategoryLabel(place.category)} · ${getCountryLabel(place.country_code)}`,
    latitude: place.latitude,
    longitude: place.longitude,
    kakaoPlaceId: place.kakao_place_id,
    googlePlaceId: place.google_place_id,
    sourceTitle: place.source_link.title,
    sourceUrl: place.source_link.url,
    sourceLabel: `${place.source_link.title} · 영상 보러 가기`,
    thumbnailUrl: getPlaceThumbnailUrl(place),
    sourceThumbnailUrl: getPlaceSourceThumbnailUrl(place),
    evidence: place.evidence,
  };
}
