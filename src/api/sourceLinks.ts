import { apiClient } from './client';

import type { QueryParams } from './common';
import type {
  SourceLinksResponse,
  SubmitSourceLinkRequest,
  SubmitSourceLinkResponse,
} from './sourceLinks/types';

export async function submitSourceLink(body: SubmitSourceLinkRequest) {
  const { data } = await apiClient.post<SubmitSourceLinkResponse>('/source-links', body);
  return data;
}

export async function listSourceLinks(params?: QueryParams) {
  const { data } = await apiClient.get<SourceLinksResponse>('/source-links', { params });
  return data;
}
