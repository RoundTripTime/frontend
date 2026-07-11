import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useJobCandidatesQuery } from '@/src/api/candidates/hooks';
import { isProductionMode } from '@/src/lib/appMode';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';

import {
  clearStoredExtractionJob,
  getStoredExtractionJob,
  hasNotifiedExtractionJob,
  markExtractionJobNotified,
} from './activeExtractionJobStorage';
import { registerExtractionBackgroundTask } from './backgroundTask';
import { configureExtractionNotifications, notifyExtractionCompleted } from './notifications';

const waitingStatuses = new Set(['pending', 'processing']);
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

// TODO(server-push): 서버 완료 push가 도입되면 foreground polling은 fallback/debug 용도로 축소한다.
export function ExtractionJobWatcher() {
  const jobId = usePlaceCandidateStore((state) => state.jobId);
  const hydrateActiveJob = usePlaceCandidateStore((state) => state.hydrateActiveJob);
  const setAnalysisResult = usePlaceCandidateStore((state) => state.setAnalysisResult);
  const notifiedJobRef = useRef<string | null>(null);
  const candidatesQuery = useJobCandidatesQuery(jobId ?? '');

  useEffect(() => {
    void configureExtractionNotifications();
    void registerExtractionBackgroundTask();

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

  useEffect(() => {
    if (!candidatesQuery.data || !jobId) {
      return;
    }

    setAnalysisResult(candidatesQuery.data, jobId);

    const status = candidatesQuery.data.source_link.status;

    if (!status || waitingStatuses.has(status) || status === 'failed') {
      return;
    }

    if (notifiedJobRef.current === jobId) {
      return;
    }

    notifiedJobRef.current = jobId;
    void hasNotifiedExtractionJob(jobId).then((hasNotified) => {
      if (hasNotified) {
        return;
      }

      void notifyExtractionCompleted(candidatesQuery.data.candidates.length).then(() => {
        void markExtractionJobNotified(jobId);
      });
    });
  }, [candidatesQuery.data, jobId, setAnalysisResult]);

  return null;
}
