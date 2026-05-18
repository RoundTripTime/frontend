import { create } from 'zustand';

import { mockPlaces } from '@/src/mocks/fixtures';

import type { PlaceCandidate } from '@/src/api/candidates/types';

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
  acceptCandidate: (candidateId: string) => void;
  rejectCandidate: (candidateId: string) => void;
};

export const usePlaceCandidateStore = create<PlaceCandidateState>((set) => ({
  candidates: initialCandidates,
  acceptCandidate: (candidateId) => {
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidate.candidate_id === candidateId ? { ...candidate, status: 'accepted' } : candidate,
      ),
    }));
  },
  rejectCandidate: (candidateId) => {
    set((state) => ({
      candidates: state.candidates.filter((candidate) => candidate.candidate_id !== candidateId),
    }));
  },
}));

export const selectPendingPlaceCandidateCount = (state: PlaceCandidateState) =>
  state.candidates.filter((candidate) => candidate.status === 'proposed').length;
