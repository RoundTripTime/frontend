import { listJobCandidates } from '@/src/api/candidates';

import {
  getStoredExtractionJob,
  hasNotifiedExtractionJob,
  markExtractionJobNotified,
} from './activeExtractionJobStorage';
import { notifyExtractionCompleted } from './notifications';

import type { PlaceCandidatesResponse } from '@/src/api/candidates/types';

export type ActiveExtractionPollResult =
  | { status: 'idle' }
  | { result: PlaceCandidatesResponse; status: 'waiting' | 'completed' | 'failed' };

const waitingStatuses = new Set(['pending', 'processing']);

export async function pollActiveExtractionJob(): Promise<ActiveExtractionPollResult> {
  const activeJob = await getStoredExtractionJob();

  if (!activeJob) {
    return { status: 'idle' };
  }

  const result = await listJobCandidates(activeJob.jobId);
  const sourceStatus = result.source_link.status;

  if (sourceStatus === 'failed') {
    return { result, status: 'failed' };
  }

  if (sourceStatus && waitingStatuses.has(sourceStatus)) {
    return { result, status: 'waiting' };
  }

  if (!(await hasNotifiedExtractionJob(activeJob.jobId))) {
    await notifyExtractionCompleted(result.candidates.length);
    await markExtractionJobNotified(activeJob.jobId);
  }

  return { result, status: 'completed' };
}
