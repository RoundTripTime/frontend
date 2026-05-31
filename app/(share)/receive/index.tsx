import { Link, router, type Href, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { listJobCandidates } from '@/src/api/candidates';
import { submitSourceLink } from '@/src/api/sourceLinks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

import type { MappedApiError } from '@/src/api/errorMap';

export default function ShareReceiveScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const params = useLocalSearchParams<{ url?: string }>();
  const incomingUrl = useMemo(() => {
    const value = Array.isArray(params.url) ? params.url[0] : params.url;
    return value?.trim() || '';
  }, [params.url]);
  const [url, setUrl] = useState(incomingUrl);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'succeeded' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const activeJobId = usePlaceCandidateStore((state) => state.jobId);
  const activeSourceLink = usePlaceCandidateStore((state) => state.sourceLink);
  const setAnalysisResult = usePlaceCandidateStore((state) => state.setAnalysisResult);
  const autoSubmittedRef = useRef(false);

  const createAnalysisJob = async (sharedUrl: string) => {
    const submitted = await submitSourceLink({ url: sharedUrl });
    const candidates = await listJobCandidates(submitted.job_id);

    setAnalysisResult(candidates, submitted.job_id);
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
  const canSubmit = !isSubmitting;

  return (
    <View style={styles.container}>
      <DevScreenHeader screenName="링크 수신 / 분석 중" screenNumber="S-03" />
      {/*
        화면: 링크 수신 / 분석 중 (S-03)
        기능: iOS Share Extension / Android Share Intent로 전달된 URL을 백엔드에 제출해 장소 분석 잡을 생성한다. 개발 단계에서는 URL 입력과 제출 버튼으로 공유 intent 진입을 시뮬레이션한다.
        가능한 다음 이동 화면: S-02, S-04
      */}
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
        inputMode="url"
        onChangeText={setUrl}
        placeholder="공유 URL을 입력하세요"
        placeholderTextColor={theme.semantic.placeholder}
        style={styles.input}
        value={url}
      />
      <TouchableOpacity
        disabled={!canSubmit}
        onPress={() => {
          void submitUrl();
        }}
        style={[styles.submitButton, !canSubmit && styles.disabledButton]}
      >
        <Text style={styles.submitButtonText}>{isSubmitting ? '제출 중' : '제출'}</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Link href={'/' as Href} style={styles.link}>
        앱으로 돌아가기
      </Link>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.semantic.background,
      alignItems: 'center',
      flex: 1,
      gap: 14,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      backgroundColor: theme.semantic.input,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      color: theme.semantic.text,
      paddingHorizontal: 12,
      paddingVertical: 12,
      width: '100%',
    },
    submitButton: {
      backgroundColor: theme.semantic.primary,
      borderRadius: 8,
      padding: 13,
      width: '100%',
    },
    submitButtonText: {
      color: theme.semantic.onPrimary,
      fontWeight: '800',
      textAlign: 'center',
    },
    disabledButton: { opacity: 0.5 },
    message: { color: theme.semantic.textSecondary, fontWeight: '700', textAlign: 'center' },
    link: { color: theme.semantic.textMuted, fontWeight: '700' },
  });
