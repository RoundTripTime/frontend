import type { ID, ISODateTime, PaginatedResponse } from '../common';

export type JobStatus = 'pending' | 'processing' | 'done' | 'failed';

export type SourceType = 'youtube_short' | 'instagram_reel' | string;

export type SubmitSourceLinkRequest = {
  url: string;
};

export type SubmitSourceLinkResponse = {
  source_link_id: ID;
  job_id: ID;
  job_status: JobStatus;
  source_type: SourceType;
  submitted_at: ISODateTime;
};

export type SourceLink = {
  source_link_id: ID;
  url: string;
  source_type: SourceType;
  title: string;
  thumbnail_url: string;
  job_status: JobStatus;
  submitted_at: ISODateTime;
};

export type SourceLinksResponse = PaginatedResponse<SourceLink>;
