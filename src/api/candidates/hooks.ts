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
    refetchInterval: (query) => {
      const status = query.state.data?.source_link.status;

      return status === 'pending' || status === 'processing' ? 3000 : false;
    },
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
