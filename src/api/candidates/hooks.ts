import { useMutation, useQuery } from '@tanstack/react-query';

import { batchUpdateCandidates, listJobCandidates, updateCandidate } from '../candidates';

export const candidateKeys = {
  byJob: (jobId: string) => ['candidates', 'job', jobId] as const,
};

export function useJobCandidatesQuery(jobId: string) {
  return useQuery({
    queryKey: candidateKeys.byJob(jobId),
    queryFn: () => listJobCandidates(jobId),
    enabled: !!jobId,
  });
}

export function useUpdateCandidateMutation() {
  return useMutation({
    mutationFn: ({
      candidateId,
      status,
    }: {
      candidateId: string;
      status: 'accepted' | 'rejected' | 'edited';
    }) => updateCandidate(candidateId, { status }),
  });
}

export function useBatchUpdateCandidatesMutation() {
  return useMutation({ mutationFn: batchUpdateCandidates });
}
