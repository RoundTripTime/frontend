import { apiClient, type AuthAwareRequestConfig } from './client';

import type { QueryParams } from './common';
import type {
  NotificationsResponse,
  ReadNotificationResponse,
  RegisterDeviceTokenRequest,
  UnregisterDeviceTokenRequest,
} from './notifications/types';

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

export async function registerDeviceToken(payload: RegisterDeviceTokenRequest) {
  await apiClient.post('/notifications/device-tokens', payload);
}

export async function unregisterDeviceToken(payload: UnregisterDeviceTokenRequest) {
  const config: AuthAwareRequestConfig<UnregisterDeviceTokenRequest> = {
    _skipAuthFailure: true,
    data: payload,
  };

  await apiClient.delete('/notifications/device-tokens', config);
}
