import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  candidateKeys,
  useBatchUpdateCandidatesMutation,
  useJobCandidatesQuery,
} from '@/src/api/candidates/hooks';
import { useNotificationsQuery } from '@/src/api/notifications/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { EmptyState } from '@/src/components/EmptyState';
import { PlanListSkeleton } from '@/src/components/LoadingSkeleton';
import {
  createPlaceCandidateCardViewModel,
  getPlaceCandidateId,
  hasResolvedCandidatePlace,
  type PlaceCandidateCardViewModel,
} from '@/src/features/places/viewModel';
import { queryClient, queryKeys } from '@/src/lib/queryClient';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

type RecentPlaceResultStatus = 'places_resolved' | 'candidates_only' | 'no_candidates' | 'failed';

type UnresolvedCandidateCardViewModel = Omit<
  PlaceCandidateCardViewModel,
  'latitude' | 'longitude' | 'placeId'
> & {
  latitude: null;
  longitude: null;
  placeId: null;
};

type RecentCandidateCardViewModel = PlaceCandidateCardViewModel | UnresolvedCandidateCardViewModel;

type CandidateActionButtonProps = {
  disabled: boolean;
  label: string;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
};

function CandidateActionButton({
  disabled,
  label,
  onPress,
  style,
  textStyle,
}: CandidateActionButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      disabled={disabled}
      style={[styles.actionButton, style, disabled && styles.disabledButton]}
      onPress={onPress}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

function getRecentPlaceResultStatus(
  sourceStatus: string | undefined,
  candidates: RecentCandidateCardViewModel[],
): RecentPlaceResultStatus | null {
  if (sourceStatus === 'failed') {
    return 'failed';
  }

  if (sourceStatus !== 'done') {
    return null;
  }

  if (candidates.length === 0) {
    return 'no_candidates';
  }

  if (candidates.some((candidate) => candidate.placeId)) {
    return 'places_resolved';
  }

  return 'candidates_only';
}

export default function RecentPlacesScreen() {
  const params = useLocalSearchParams<{ jobId?: string }>();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const cachedCandidates = usePlaceCandidateStore((state) => state.candidates);
  const cachedSourceLink = usePlaceCandidateStore((state) => state.sourceLink);
  const storedJobId = usePlaceCandidateStore((state) => state.jobId);
  const routeJobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const notificationsQuery = useNotificationsQuery({ limit: 5 });
  const latestNotificationJobId = notificationsQuery.data?.items.find(
    (notification) => notification.job_id,
  )?.job_id;
  const jobId = routeJobId ?? latestNotificationJobId ?? storedJobId;
  const setAnalysisResult = usePlaceCandidateStore((state) => state.setAnalysisResult);
  const candidatesQuery = useJobCandidatesQuery(jobId ?? '');
  const batchUpdateCandidatesMutation = useBatchUpdateCandidatesMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const rawCandidates = candidatesQuery.data?.candidates ?? cachedCandidates;
  const candidates = rawCandidates.filter((candidate) => candidate.status === 'proposed');
  const sourceLink = candidatesQuery.data?.source_link ?? cachedSourceLink;
  const sourceStatus = sourceLink?.status;
  const isAnalysisWaiting = sourceStatus === 'pending' || sourceStatus === 'processing';
  const analysisFailed = sourceStatus === 'failed';
  const wasWaitingRef = useRef(false);
  const candidateCards = useMemo<RecentCandidateCardViewModel[]>(
    () =>
      candidates.map((candidate) => {
        const candidateId = getPlaceCandidateId(candidate);

        if (hasResolvedCandidatePlace(candidate)) {
          return createPlaceCandidateCardViewModel(candidate);
        }

        return {
          id: candidateId,
          placeId: null,
          name: candidate.candidate_name,
          category: candidate.category,
          countryLabel: '장소 확인 필요',
          status: candidate.status,
          statusLabel: '확인 대기',
          evidence: candidate.evidence,
          latitude: null,
          longitude: null,
          thumbnailUrl: undefined,
        };
      }),
    [candidates],
  );
  const resultStatus = getRecentPlaceResultStatus(sourceStatus, candidateCards);
  const selectableIds = useMemo(
    () => candidateCards.map((candidate) => candidate.id).filter(Boolean),
    [candidateCards],
  );
  const selectedCount = selectedIds.length;
  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  const isMutating = batchUpdateCandidatesMutation.isPending;

  useEffect(() => {
    if (candidatesQuery.data && jobId) {
      setAnalysisResult(candidatesQuery.data, jobId);
    }
  }, [candidatesQuery.data, jobId, setAnalysisResult]);

  useEffect(() => {
    if (isAnalysisWaiting) {
      wasWaitingRef.current = true;
      return;
    }

    if (wasWaitingRef.current && rawCandidates.length > 0) {
      wasWaitingRef.current = false;
      Alert.alert('분석 완료', `새 장소 후보가 ${rawCandidates.length}개 도착했어요.`);
    }
  }, [isAnalysisWaiting, rawCandidates.length]);

  const updateSelectedCandidates = async (status: 'accepted' | 'rejected') => {
    if (!jobId || selectedIds.length === 0) {
      return false;
    }

    try {
      await batchUpdateCandidatesMutation.mutateAsync({
        candidates: selectedIds.map((candidateId) => ({
          candidate_id: candidateId,
          status,
        })),
      });
      await queryClient.invalidateQueries({ queryKey: candidateKeys.byJob(jobId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.collections.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.places.all() });
      return true;
    } catch {
      Alert.alert('처리 실패', '장소 후보를 처리하지 못했어요. 잠시 후 다시 시도해주세요.');
      return false;
    }
  };

  const finishToHome = async () => {
    const succeeded = await updateSelectedCandidates('accepted');
    if (!succeeded) {
      return;
    }
    setSelectedIds([]);
    router.replace('/');
  };

  const toggleCandidate = (candidateId: string) => {
    setSelectedIds((current) =>
      current.includes(candidateId)
        ? current.filter((selectedId) => selectedId !== candidateId)
        : [...current, candidateId],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : selectableIds);
  };

  const deleteSelected = async () => {
    const succeeded = await updateSelectedCandidates('rejected');
    if (!succeeded) {
      return;
    }
    setSelectedIds([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="최근 추가한 장소" screenNumber="S-04" />
      {/*
        화면: 최근 추가한 장소 (S-04)
        기능: 분석 완료된 장소 후보를 선택/해제하고 선택한 장소를 플레이스 또는 플랜에 추가하거나 삭제한다.
        가능한 다음 이동 화면: S-02, S-05, S-07
      */}
      <View style={styles.source}>
        <Text style={styles.sourceTitle}>{sourceLink?.title ?? '분석 출처 링크'}</Text>
        <Text style={styles.sourceUrl}>{sourceLink?.url ?? '공유 링크 정보 없음'}</Text>
      </View>
      <View style={styles.selectionHeader}>
        <Text style={styles.selectionSummary}>선택한 장소 {selectedCount}개</Text>
        <Pressable disabled={selectableIds.length === 0} onPress={toggleAll}>
          <Text style={styles.selectAll}>{allSelected ? '전체 해제' : '전체 선택'}</Text>
        </Pressable>
      </View>
      {candidatesQuery.isPending && !candidatesQuery.data && cachedCandidates.length === 0 ? (
        <PlanListSkeleton count={3} />
      ) : !jobId ? (
        <EmptyState
          description="URL을 공유하거나 제출하면 분석된 장소 후보가 이곳에 표시됩니다."
          title="분석된 장소 후보가 없습니다"
        />
      ) : isAnalysisWaiting ? (
        <EmptyState description="끝나면 알려드릴게요." title="분석 중입니다" />
      ) : resultStatus === 'failed' || analysisFailed ? (
        <EmptyState
          description="다시 제출하거나 잠시 후 시도해주세요."
          title="링크 분석에 실패했어요"
        />
      ) : resultStatus === 'no_candidates' ? (
        <EmptyState
          description="다른 링크를 공유하거나 직접 장소를 추가해보세요."
          title="분석은 완료됐지만 장소를 찾지 못했어요"
        />
      ) : resultStatus === null ? (
        <EmptyState
          description="URL을 공유하거나 제출하면 분석된 장소 후보가 이곳에 표시됩니다."
          title="분석된 장소 후보가 없습니다"
        />
      ) : (
        candidateCards.map((candidate) => (
          <Pressable
            key={candidate.id}
            style={[styles.card, selectedIds.includes(candidate.id) && styles.selectedCard]}
            onPress={() => {
              if (resultStatus === 'places_resolved' && candidate.placeId) {
                router.push(
                  `/places/${candidate.placeId}?entry=candidate&candidateId=${candidate.id}`,
                );
                return;
              }

              toggleCandidate(candidate.id);
            }}
          >
            <View style={styles.cardPreview}>
              <View style={styles.thumbnail} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{candidate.name}</Text>
                <Text style={styles.cardMeta}>
                  {candidate.category} · {candidate.countryLabel}
                </Text>
              </View>
              <Pressable
                hitSlop={10}
                style={[styles.check, selectedIds.includes(candidate.id) && styles.checked]}
                onPress={(event) => {
                  event.stopPropagation();
                  toggleCandidate(candidate.id);
                }}
              >
                <Text style={styles.checkText}>
                  {selectedIds.includes(candidate.id) ? '✓' : ''}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        ))
      )}
      <View style={styles.bottomActions}>
        <CandidateActionButton
          disabled={selectedCount === 0 || isMutating}
          label="수락"
          onPress={() => {
            void finishToHome();
          }}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />
        <CandidateActionButton
          disabled={selectedCount === 0 || isMutating}
          label="거절"
          onPress={() => {
            void deleteSelected();
          }}
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
        />
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.semantic.background,
      gap: 14,
      padding: 20,
      paddingBottom: 32,
      paddingTop: 20,
    },
    source: { backgroundColor: theme.semantic.primarySoft, borderRadius: 8, gap: 6, padding: 14 },
    sourceTitle: { color: theme.semantic.primaryDeep, fontWeight: '800' },
    sourceUrl: { color: theme.semantic.primaryDeep },
    empty: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      padding: 24,
    },
    emptyText: { color: theme.semantic.textMuted, fontWeight: '700' },
    selectionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    selectionSummary: { color: theme.semantic.text, fontSize: 16, fontWeight: '800' },
    selectAll: { color: theme.semantic.primary, fontWeight: '800' },
    card: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 12,
      padding: 12,
    },
    selectedCard: {
      backgroundColor: theme.semantic.primarySoft,
      borderColor: theme.semantic.primary,
    },
    cardPreview: { flexDirection: 'row', gap: 12 },
    thumbnail: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 6,
      height: 84,
      width: 84,
    },
    cardContent: { flex: 1, gap: 8, justifyContent: 'center' },
    cardTitle: { color: theme.semantic.text, fontSize: 17, fontWeight: '800' },
    cardMeta: { color: theme.semantic.textMuted },
    check: {
      alignItems: 'center',
      borderColor: theme.semantic.borderStrong,
      borderRadius: 12,
      borderWidth: 1,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    checked: {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
    },
    checkText: { color: theme.semantic.onPrimary, fontSize: 14, fontWeight: '900' },
    bottomActions: { gap: 10 },
    disabledButton: { opacity: 0.45 },
    actionButton: {
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 50,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    primaryButton: {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
    },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    deleteButton: {
      backgroundColor: theme.semantic.danger,
      borderColor: theme.semantic.danger,
    },
    deleteButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
  });
