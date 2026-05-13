import { useMutation, useQuery } from '@tanstack/react-query';

import { listNotifications, markNotificationRead } from '../notifications';

import type { QueryParams } from '../common';

export const notificationKeys = {
  list: (params?: QueryParams) => ['notifications', params] as const,
};

export function useNotificationsQuery(params?: QueryParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => listNotifications(params),
  });
}

export function useMarkNotificationReadMutation() {
  return useMutation({ mutationFn: markNotificationRead });
}
