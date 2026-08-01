import { apiClient } from './client';

import type {
  BatchCandidateUpdateRequest,
  BatchCandidateUpdateResponse,
  PlaceCandidate,
  PlaceCandidatesResponse,
  UpdateCandidateRequest,
} from './candidates/types';

export async function listJobCandidates(jobId: string) {
  const { data } = await apiClient.get<PlaceCandidatesResponse>(`/jobs/${jobId}/candidates`);
  return data;
}

export async function updateCandidate(candidateId: string, body: UpdateCandidateRequest) {
  const { data } = await apiClient.patch<PlaceCandidate>(`/candidates/${candidateId}`, body);
  return data;
}

export async function batchUpdateCandidates(body: BatchCandidateUpdateRequest) {
  const { data } = await apiClient.post<BatchCandidateUpdateResponse>('/candidates/batch', body);
  return data;
}
