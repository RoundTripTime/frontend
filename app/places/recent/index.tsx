import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { createPlaceCandidateCardViewModel } from '@/src/features/places/viewModel';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

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

export default function RecentPlacesScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const candidates = usePlaceCandidateStore((state) => state.candidates);
  const sourceLink = usePlaceCandidateStore((state) => state.sourceLink);
  const acceptCandidates = usePlaceCandidateStore((state) => state.acceptCandidates);
  const removeCandidates = usePlaceCandidateStore((state) => state.removeCandidates);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const candidateCards = useMemo(
    () => candidates.map(createPlaceCandidateCardViewModel),
    [candidates],
  );
  const selectableIds = useMemo(
    () => candidateCards.map((candidate) => candidate.id),
    [candidateCards],
  );
  const selectedCount = selectedIds.length;
  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;

  const finishToHome = () => {
    acceptCandidates(selectedIds);
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

  const deleteSelected = () => {
    removeCandidates(selectedIds);
    setSelectedIds([]);
  };

  const addToPlan = () => {
    acceptCandidates(selectedIds);
    router.push('/plans/new');
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
      {candidateCards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>모든 후보를 처리했어요.</Text>
        </View>
      ) : (
        candidateCards.map((candidate) => (
          <Pressable
            key={candidate.id}
            style={[styles.card, selectedIds.includes(candidate.id) && styles.selectedCard]}
            onPress={() => toggleCandidate(candidate.id)}
          >
            <View style={styles.cardPreview}>
              <View style={styles.thumbnail} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{candidate.name}</Text>
                <Text style={styles.cardMeta}>
                  {candidate.category} · {candidate.countryLabel}
                </Text>
              </View>
              <View style={[styles.check, selectedIds.includes(candidate.id) && styles.checked]}>
                <Text style={styles.checkText}>
                  {selectedIds.includes(candidate.id) ? '✓' : ''}
                </Text>
              </View>
            </View>
          </Pressable>
        ))
      )}
      <View style={styles.bottomActions}>
        <CandidateActionButton
          disabled={selectedCount === 0}
          label="플레이스에 추가"
          onPress={finishToHome}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />
        <CandidateActionButton
          disabled={selectedCount === 0}
          label="플랜에 추가"
          onPress={addToPlan}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
        <CandidateActionButton
          disabled={selectedCount === 0}
          label="삭제"
          onPress={deleteSelected}
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
      paddingTop: 32,
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
    secondaryButton: {
      backgroundColor: theme.semantic.background,
      borderColor: theme.semantic.borderStrong,
    },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '800', textAlign: 'center' },
    deleteButton: {
      backgroundColor: theme.semantic.danger,
      borderColor: theme.semantic.danger,
    },
    deleteButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
  });
