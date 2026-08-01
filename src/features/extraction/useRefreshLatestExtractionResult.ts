import { useCallback } from 'react';

import { listJobCandidates } from '@/src/api/candidates';
import { listNotifications } from '@/src/api/notifications';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';

export function useRefreshLatestExtractionResult() {
  const setAnalysisResult = usePlaceCandidateStore((state) => state.setAnalysisResult);

  return useCallback(async () => {
    const notifications = await listNotifications({ limit: 5 });
    const latestJobId = notifications.items.find((notification) => notification.job_id)?.job_id;

    if (!latestJobId) {
      return;
    }

    const candidates = await listJobCandidates(latestJobId);
    setAnalysisResult(candidates, latestJobId);
  }, [setAnalysisResult]);
}
