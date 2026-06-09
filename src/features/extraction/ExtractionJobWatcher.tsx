import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useJobCandidatesQuery } from '@/src/api/candidates/hooks';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';

import {
  getStoredExtractionJob,
  hasNotifiedExtractionJob,
  markExtractionJobNotified,
} from './activeExtractionJobStorage';
import { registerExtractionBackgroundTask } from './backgroundTask';
import { configureExtractionNotifications, notifyExtractionCompleted } from './notifications';

const waitingStatuses = new Set(['pending', 'processing']);

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

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const href = response.notification.request.content.data?.href;

      if (href === '/places/recent') {
        router.push('/places/recent');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    void getStoredExtractionJob().then((activeJob) => {
      if (activeJob) {
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
