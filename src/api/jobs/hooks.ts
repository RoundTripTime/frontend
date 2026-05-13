import { useQuery } from '@tanstack/react-query';

import { getJob } from '../jobs';

export const jobKeys = {
  detail: (jobId: string) => ['jobs', jobId] as const,
};

export function useJobQuery(jobId: string) {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });
}
