import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryClient';

import { getJob } from '../jobs';

export const jobKeys = queryKeys.jobs;

export function useJobQuery(jobId: string) {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });
}
