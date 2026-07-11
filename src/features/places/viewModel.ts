import type { PlaceCandidate } from '@/src/api/candidates/types';
import type { PlaceDetail, PlaceSummary } from '@/src/api/places/types';

export type PlaceRegionFilter = '전체' | '일본' | '한국' | '동남아';

export type PlaceCardViewModel = {
  id: string;
  name: string;
  category: string;
  countryLabel: string;
  region: PlaceRegionFilter;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
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
  evidence: string;
};

const countryLabels: Record<string, string> = {
  JP: '일본',
  KR: '한국',
  TH: '태국',
  VN: '베트남',
};

const candidateStatusLabels: Record<PlaceCandidate['status'], string> = {
  accepted: '수락됨',
  edited: '수정됨',
  proposed: '확인 대기',
  rejected: '거절됨',
};

function getCountryLabel(countryCode: string) {
  return countryLabels[countryCode] ?? countryCode;
}

function getRegion(countryCode: string): PlaceRegionFilter {
  if (countryCode === 'JP') {
    return '일본';
  }

  if (countryCode === 'KR') {
    return '한국';
  }

  return '동남아';
}

export function createPlaceCardViewModel(place: PlaceSummary): PlaceCardViewModel {
  return {
    id: place.place_id,
    name: place.canonical_name,
    category: place.category,
    countryLabel: getCountryLabel(place.country_code),
    region: getRegion(place.country_code),
    latitude: place.latitude,
    longitude: place.longitude,
    thumbnailUrl: place.thumbnail_url,
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

export function createPlaceCandidateCardViewModel(
  candidate: ResolvedPlaceCandidate,
): PlaceCandidateCardViewModel {
  return {
    id: getPlaceCandidateId(candidate),
    placeId: candidate.place.place_id,
    name: candidate.place.canonical_name,
    category: candidate.category,
    countryLabel: getCountryLabel(candidate.place.country_code),
    status: candidate.status,
    statusLabel: candidateStatusLabels[candidate.status],
    evidence: candidate.evidence,
    latitude: candidate.place.latitude,
    longitude: candidate.place.longitude,
    thumbnailUrl: candidate.place.thumbnail_url,
  };
}

export function createPlaceDetailViewModel(place: PlaceDetail): PlaceDetailViewModel {
  return {
    id: place.place_id,
    name: place.canonical_name,
    meta: `${place.category} · ${getCountryLabel(place.country_code)}`,
    latitude: place.latitude,
    longitude: place.longitude,
    kakaoPlaceId: place.kakao_place_id,
    googlePlaceId: place.google_place_id,
    sourceTitle: place.source_link.title,
    sourceUrl: place.source_link.url,
    sourceLabel: `${place.source_link.title} · 영상 보러 가기`,
    evidence: place.evidence,
  };
}
