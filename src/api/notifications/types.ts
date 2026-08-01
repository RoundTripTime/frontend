import type { ID, ISODateTime, PaginatedResponse } from '../common';

export type NotificationType = 'job_completed' | 'job_failed';

export type Notification = {
  notification_id: ID;
  type: NotificationType;
  job_id: ID;
  message: string;
  is_read: boolean;
  created_at: ISODateTime;
};

export type NotificationsResponse = PaginatedResponse<Notification>;

export type ReadNotificationResponse = {
  notification_id: ID;
  is_read: true;
};

export type DeviceTokenPlatform = 'android' | 'ios';

export type RegisterDeviceTokenRequest = {
  platform: DeviceTokenPlatform;
  token: string;
};

export type UnregisterDeviceTokenRequest = {
  token: string;
};
