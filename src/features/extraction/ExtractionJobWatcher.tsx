import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { isProductionMode } from '@/src/lib/appMode';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';

import { clearStoredExtractionJob, getStoredExtractionJob } from './activeExtractionJobStorage';
import { configureExtractionNotifications } from './notifications';

const DEVELOPMENT_JOB_ID = 'mock-job';

function routeNotificationResponse(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data;
  const href = data?.href;
  const jobId = data?.job_id ?? data?.jobId;

  console.log('[Notifications] response data', data);

  if (typeof jobId === 'string' && jobId.length > 0) {
    router.push(`/places/recent?jobId=${encodeURIComponent(jobId)}`);
    return;
  }

  if (typeof href === 'string' && href.startsWith('/places/recent')) {
    router.push('/places/recent');
    return;
  }

  router.push('/places/recent');
}

export function ExtractionJobWatcher() {
  const hydrateActiveJob = usePlaceCandidateStore((state) => state.hydrateActiveJob);

  useEffect(() => {
    void configureExtractionNotifications();

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        routeNotificationResponse(response);
      }
    });

    const subscription =
      Notifications.addNotificationResponseReceivedListener(routeNotificationResponse);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    void getStoredExtractionJob().then((activeJob) => {
      if (activeJob) {
        if (isProductionMode && activeJob.jobId === DEVELOPMENT_JOB_ID) {
          void clearStoredExtractionJob();
          return;
        }

        hydrateActiveJob(activeJob.jobId);
      }
    });
  }, [hydrateActiveJob]);

  return null;
}
