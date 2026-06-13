import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

import { listJobCandidates } from '@/src/api/candidates';
import { submitSourceLink } from '@/src/api/sourceLinks';
import { getAccessToken } from '@/src/lib/tokenStore';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';

import type { MappedApiError } from '@/src/api/errorMap';

type SubmissionStatus = 'idle' | 'submitting' | 'succeeded' | 'failed';
type ShareReceiveParams = { from?: string; url?: string };

const ANDROID_SHARE_SOURCE = 'android-share';

export function useShareReceiveController() {
  const params = useLocalSearchParams<ShareReceiveParams>();
  const incomingUrl = useMemo(() => {
    const value = Array.isArray(params.url) ? params.url[0] : params.url;
    return value?.trim() || '';
  }, [params.url]);
  const isAndroidShare = useMemo(() => {
    const value = Array.isArray(params.from) ? params.from[0] : params.from;
    return value === ANDROID_SHARE_SOURCE && Platform.OS === 'android';
  }, [params.from]);
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

  const showAndroidShareToast = (toastMessage: string) => {
    if (isAndroidShare) {
      ToastAndroid.show(toastMessage, ToastAndroid.SHORT);
    }
  };

  const exitAndroidShare = () => {
    if (isAndroidShare) {
      setTimeout(() => {
        BackHandler.exitApp();
      }, 250);
    }
  };

  const completeSubmission = (nextMessage: string) => {
    setStatus('succeeded');
    setMessage(nextMessage);

    if (isAndroidShare) {
      showAndroidShareToast(nextMessage);
      exitAndroidShare();
      return;
    }

    router.replace('/places/recent');
  };

  const fallbackToAuth = () => {
    setStatus('failed');
    setMessage('로그인이 필요합니다.');

    if (isAndroidShare) {
      showAndroidShareToast('로그인이 필요합니다.');
      router.replace('/(auth)/onboarding');
    }
  };

  const returnToSource = () => {
    if (isAndroidShare) {
      BackHandler.exitApp();
      return;
    }

    router.replace('/');
  };

  const submitUrl = async (sharedUrl = url) => {
    const trimmedUrl = sharedUrl.trim();

    if (!trimmedUrl) {
      setStatus('failed');
      setMessage('분석할 URL을 입력해주세요.');
      return;
    }

    if (isAndroidShare) {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        fallbackToAuth();
        return;
      }
    }

    setStatus('submitting');
    setMessage('공유 링크를 제출하고 있어요.');

    try {
      await createAnalysisJob(trimmedUrl);
      completeSubmission('분석을 시작했어요.');
    } catch (error) {
      const mappedError = error as Partial<MappedApiError>;
      const isTokenFailure = mappedError.status === 401 || mappedError.code === 'UNAUTHORIZED';

      if (
        mappedError.code === 'DUPLICATE_LINK' &&
        activeJobId &&
        activeSourceLink?.url === trimmedUrl
      ) {
        completeSubmission('이미 처리 중인 링크예요.');
        return;
      }

      if (mappedError.code === 'DUPLICATE_LINK' && isAndroidShare) {
        completeSubmission('이미 처리 중인 링크예요.');
        return;
      }

      if (isTokenFailure) {
        fallbackToAuth();
        return;
      }

      setStatus('failed');
      const fallbackMessage =
        mappedError.code === 'DUPLICATE_LINK'
          ? '이미 처리 중인 링크예요. 잠시 후 최근 추가한 장소에서 확인해주세요.'
          : (mappedError.message ?? '링크 제출에 실패했어요. 잠시 후 다시 시도해주세요.');
      const nextMessage = isAndroidShare ? '네트워크 문제로 제출하지 못했어요.' : fallbackMessage;

      setMessage(nextMessage);
      showAndroidShareToast(nextMessage);
    }
  };

  useEffect(() => {
    if (!incomingUrl || autoSubmittedRef.current) {
      return;
    }

    autoSubmittedRef.current = true;
    setUrl(incomingUrl);

    if (isAndroidShare) {
      return;
    }

    void submitUrl(incomingUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingUrl, isAndroidShare]);

  const isSubmitting = status === 'submitting';

  return {
    canSubmit: !isSubmitting,
    isSubmitting,
    message,
    returnLabel: isAndroidShare ? '이전 앱으로 돌아가기' : '앱으로 돌아가기',
    returnToSource,
    setUrl,
    submitUrl,
    url,
  };
}
