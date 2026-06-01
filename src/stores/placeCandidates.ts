import { create } from 'zustand';

import { isDevelopmentMode } from '@/src/lib/appMode';
import { mockPlaces } from '@/src/mocks/fixtures';

import type { PlaceCandidate, PlaceCandidatesResponse } from '@/src/api/candidates/types';

type PlaceCandidateState = {
  candidates: PlaceCandidate[];
  jobId: string | null;
  sourceLink: PlaceCandidatesResponse['source_link'] | null;
  acceptCandidate: (candidateId: string) => void;
  acceptCandidates: (candidateIds: string[]) => void;
  rejectCandidate: (candidateId: string) => void;
  removeCandidates: (candidateIds: string[]) => void;
  setAnalysisResult: (result: PlaceCandidatesResponse, jobId?: string) => void;
};

const shouldSeedDevelopmentCandidates = isDevelopmentMode;
const DEVELOPMENT_CANDIDATE_LIMIT = 4;
const DEVELOPMENT_JOB_ID = 'mock-job';
const DEVELOPMENT_SOURCE_LINK_ID = 'mock-source-link';

function createDevelopmentCandidates(): PlaceCandidate[] {
  return mockPlaces.slice(0, DEVELOPMENT_CANDIDATE_LIMIT).map((place, index) => ({
    candidate_id: `mock-candidate-${index + 1}`,
    candidate_name: place.canonical_name,
    category: place.category,
    confidence_score: 0.92,
    evidence: place.evidence,
    place: {
      ...place,
      google_place_id: place.google_place_id,
      kakao_place_id: place.kakao_place_id,
    },
    rank_order: index + 1,
    requires_confirmation: false,
    status: 'proposed',
  }));
}

function createDevelopmentSourceLink(): PlaceCandidatesResponse['source_link'] {
  return {
    id: DEVELOPMENT_SOURCE_LINK_ID,
    source_link_id: DEVELOPMENT_SOURCE_LINK_ID,
    source_type: 'youtube_short',
    status: 'done',
    submitted_at: '2026-05-16T00:00:00Z',
    thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
    title: '도쿄 맛집 VLOG',
    url: 'https://example.com/tokyo-food',
  };
}

const developmentCandidates = shouldSeedDevelopmentCandidates ? createDevelopmentCandidates() : [];

const developmentSourceLink = shouldSeedDevelopmentCandidates
  ? createDevelopmentSourceLink()
  : null;

export const usePlaceCandidateStore = create<PlaceCandidateState>((set) => ({
  candidates: developmentCandidates,
  jobId: shouldSeedDevelopmentCandidates ? DEVELOPMENT_JOB_ID : null,
  sourceLink: developmentSourceLink,
  acceptCandidate: (candidateId) => {
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidate.candidate_id === candidateId ? { ...candidate, status: 'accepted' } : candidate,
      ),
    }));
  },
  acceptCandidates: (candidateIds) => {
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidateIds.includes(candidate.candidate_id)
          ? { ...candidate, status: 'accepted' }
          : candidate,
      ),
    }));
  },
  rejectCandidate: (candidateId) => {
    set((state) => ({
      candidates: state.candidates.filter((candidate) => candidate.candidate_id !== candidateId),
    }));
  },
  removeCandidates: (candidateIds) => {
    set((state) => ({
      candidates: state.candidates.filter(
        (candidate) => !candidateIds.includes(candidate.candidate_id),
      ),
    }));
  },
  setAnalysisResult: (result, jobId) => {
    set((state) => ({
      candidates: result.candidates,
      jobId: jobId ?? state.jobId,
      sourceLink: result.source_link,
    }));
  },
}));

export const selectPendingPlaceCandidateCount = (state: PlaceCandidateState) =>
  state.candidates.filter((candidate) => candidate.status === 'proposed').length;
