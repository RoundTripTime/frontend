import { apiClient } from './client';

import type { QueryParams } from './common';
import type { NotificationsResponse, ReadNotificationResponse } from './notifications/types';

export async function listNotifications(params?: QueryParams) {
  const { data } = await apiClient.get<NotificationsResponse>('/notifications', { params });
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await apiClient.patch<ReadNotificationResponse>(
    `/notifications/${notificationId}/read`,
  );
  return data;
}
