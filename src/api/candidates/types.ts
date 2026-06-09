import type { ID } from '../common';
import type { PlaceSummary } from '../places/types';
import type { JobStatus, SourceType } from '../sourceLinks/types';

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
  place:
    | (PlaceSummary & {
        google_place_id: string;
        kakao_place_id: string;
      })
    | null;
};

export type PlaceCandidatesResponse = {
  source_link: {
    id?: ID;
    source_link_id?: ID;
    source_type?: SourceType;
    status?: JobStatus;
    submitted_at?: string;
    url: string;
    title: string | null;
    thumbnail_url: string | null;
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
