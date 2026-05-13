import { apiClient } from './client';

import type { ExtractionJob } from './jobs/types';

export async function getJob(jobId: string) {
  const { data } = await apiClient.get<ExtractionJob>(`/jobs/${jobId}`);
  return data;
}
