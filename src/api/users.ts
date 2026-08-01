import { apiClient } from './client';

import type { UpdateUserProfileRequest, UserProfile } from './users/types';

export async function getMe() {
  const { data } = await apiClient.get<UserProfile>('/users/me');
  return data;
}

export async function updateMe(body: UpdateUserProfileRequest) {
  const { data } = await apiClient.patch<UserProfile>('/users/me', body);
  return data;
}

export async function deleteMe() {
  await apiClient.delete('/users/me');
}
