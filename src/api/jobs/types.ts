import type { ID, ISODateTime } from '../common';
import type { JobStatus } from '../sourceLinks/types';

export type ExtractionJob = {
  job_id: ID;
  source_link_id: ID;
  job_status: JobStatus;
  signal_count: number;
  error_code: string | null;
  started_at: ISODateTime;
  completed_at: ISODateTime | null;
};
