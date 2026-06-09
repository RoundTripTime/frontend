import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { listJobCandidates } from '@/src/api/candidates';
import { submitSourceLink } from '@/src/api/sourceLinks';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';

import type { MappedApiError } from '@/src/api/errorMap';

type SubmissionStatus = 'idle' | 'submitting' | 'succeeded' | 'failed';

export function useShareReceiveController() {
  const params = useLocalSearchParams<{ url?: string }>();
  const incomingUrl = useMemo(() => {
    const value = Array.isArray(params.url) ? params.url[0] : params.url;
    return value?.trim() || '';
  }, [params.url]);
  const [url, setUrl] = useState(incomingUrl);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [message, setMessage] = useState('');
  const activeJobId = usePlaceCandidateStore((state) => state.jobId);
  const activeSourceLink = usePlaceCandidateStore((state) => state.sourceLink);
  const setActiveJob = usePlaceCandidateStore((state) => state.setActiveJob);
  const setAnalysisResult = usePlaceCandidateStore((state) => state.setAnalysisResult);
  const autoSubmittedRef = useRef(false);

  const createAnalysisJob = async (sharedUrl: string) => {
    const submitted = await submitSourceLink({ url: sharedUrl });
    setActiveJob(submitted.job_id, sharedUrl);

    try {
      const candidates = await listJobCandidates(submitted.job_id);
      setAnalysisResult(candidates, submitted.job_id);
    } catch {
      // Job creation already succeeded. The root extraction watcher continues polling.
    }
  };

  const submitUrl = async (sharedUrl = url) => {
    const trimmedUrl = sharedUrl.trim();

    if (!trimmedUrl) {
      setStatus('failed');
      setMessage('분석할 URL을 입력해주세요.');
      return;
    }

    setStatus('submitting');
    setMessage('공유 링크를 제출하고 있어요.');

    try {
      await createAnalysisJob(trimmedUrl);
      setStatus('succeeded');
      setMessage('분석을 시작했어요.');
      router.replace('/places/recent');
    } catch (error) {
      const mappedError = error as Partial<MappedApiError>;

      if (
        mappedError.code === 'DUPLICATE_LINK' &&
        activeJobId &&
        activeSourceLink?.url === trimmedUrl
      ) {
        setStatus('succeeded');
        setMessage('이미 처리 중인 링크예요.');
        router.replace('/places/recent');
        return;
      }

      setStatus('failed');
      setMessage(
        mappedError.code === 'DUPLICATE_LINK'
          ? '이미 처리 중인 링크예요. 잠시 후 최근 추가한 장소에서 확인해주세요.'
          : (mappedError.message ?? '링크 제출에 실패했어요. 잠시 후 다시 시도해주세요.'),
      );
    }
  };

  useEffect(() => {
    if (!incomingUrl || autoSubmittedRef.current) {
      return;
    }

    autoSubmittedRef.current = true;
    setUrl(incomingUrl);
    void submitUrl(incomingUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingUrl]);

  const isSubmitting = status === 'submitting';

  return {
    canSubmit: !isSubmitting,
    isSubmitting,
    message,
    setUrl,
    submitUrl,
    url,
  };
}
