import type { ID } from '../common';
import type { PlaceSummary } from '../places/types';

export type CandidateStatus = 'proposed' | 'accepted' | 'rejected' | 'edited';

export type PlaceCandidate = {
  candidate_id: ID;
  candidate_name: string;
  category: string;
  confidence_score: number;
  rank_order: number;
  requires_confirmation: boolean;
  status: CandidateStatus;
  evidence: string;
  place: PlaceSummary & {
    google_place_id: string;
    kakao_place_id: string;
  };
};

export type PlaceCandidatesResponse = {
  source_link: {
    url: string;
    title: string;
    thumbnail_url: string;
  };
  candidates: PlaceCandidate[];
};

export type UpdateCandidateRequest = {
  status: Extract<CandidateStatus, 'accepted' | 'rejected' | 'edited'>;
};

export type BatchCandidateUpdateRequest = {
  candidates: {
    candidate_id: ID;
    status: Extract<CandidateStatus, 'accepted' | 'rejected'>;
  }[];
};

export type BatchCandidateUpdateResponse = {
  updated: {
    candidate_id: ID;
    status: Extract<CandidateStatus, 'accepted' | 'rejected'>;
  }[];
  failed: {
    candidate_id: ID;
    reason: string;
  }[];
};
