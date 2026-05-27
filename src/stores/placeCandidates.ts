import { create } from 'zustand';

import { mockPlaces } from '@/src/mocks/fixtures';

import type { PlaceCandidate, PlaceCandidatesResponse } from '@/src/api/candidates/types';

const initialCandidates: PlaceCandidate[] = mockPlaces.map((place, index) => ({
  candidate_id: `mock-candidate-${index + 1}`,
  candidate_name: place.canonical_name,
  category: place.category,
  confidence_score: 0.92,
  evidence: place.evidence,
  place,
  rank_order: index + 1,
  requires_confirmation: false,
  status: 'proposed',
}));

type PlaceCandidateState = {
  candidates: PlaceCandidate[];
  sourceLink: PlaceCandidatesResponse['source_link'] | null;
  acceptCandidate: (candidateId: string) => void;
  acceptCandidates: (candidateIds: string[]) => void;
  rejectCandidate: (candidateId: string) => void;
  removeCandidates: (candidateIds: string[]) => void;
  setAnalysisResult: (result: PlaceCandidatesResponse) => void;
};

export const usePlaceCandidateStore = create<PlaceCandidateState>((set) => ({
  candidates: initialCandidates,
  sourceLink: {
    thumbnail_url: 'https://cdn.example.com/source/tokyo-food.jpg',
    title: '도쿄 맛집 VLOG',
    url: 'https://example.com/tokyo-food',
  },
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
  setAnalysisResult: (result) => {
    set({
      candidates: result.candidates,
      sourceLink: result.source_link,
    });
  },
}));

export const selectPendingPlaceCandidateCount = (state: PlaceCandidateState) =>
  state.candidates.filter((candidate) => candidate.status === 'proposed').length;
