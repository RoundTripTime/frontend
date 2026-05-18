import { Link, router, type Href } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { createPlaceCandidateCardViewModel } from '@/src/features/places/viewModel';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function RecentPlacesScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const candidates = usePlaceCandidateStore((state) => state.candidates);
  const acceptCandidate = usePlaceCandidateStore((state) => state.acceptCandidate);
  const rejectCandidate = usePlaceCandidateStore((state) => state.rejectCandidate);
  const candidateCards = useMemo(
    () => candidates.map(createPlaceCandidateCardViewModel),
    [candidates],
  );
  const acceptedCount = useMemo(
    () => candidates.filter((candidate) => candidate.status === 'accepted').length,
    [candidates],
  );

  const finishToHome = () => {
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="최근 추가한 장소" screenNumber="S-04" />
      {/*
        화면: 최근 추가한 장소 (S-04)
        기능: 분석 완료된 장소 후보를 확인하고 수락/거절 후 플레이스 또는 플랜에 추가한다.
        가능한 다음 이동 화면: S-02, S-05, S-07
      */}
      <View style={styles.source}>
        <Text style={styles.sourceTitle}>도쿄 맛집 VLOG</Text>
        <Text style={styles.sourceUrl}>https://example.com/tokyo-food</Text>
      </View>
      {candidateCards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>모든 후보를 처리했어요.</Text>
        </View>
      ) : (
        candidateCards.map((candidate) => (
          <View key={candidate.id} style={styles.card}>
            <Link href={`/places/${candidate.placeId}` as Href} asChild>
              <TouchableOpacity style={styles.cardPreview}>
                <View style={styles.thumbnail} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{candidate.name}</Text>
                  <Text style={styles.cardMeta}>
                    {candidate.category} · {candidate.countryLabel}
                  </Text>
                  <Text style={candidate.status === 'accepted' ? styles.accepted : styles.pending}>
                    {candidate.statusLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
            <View style={styles.actions}>
              <TouchableOpacity
                disabled={candidate.status === 'accepted'}
                style={[
                  styles.smallButton,
                  candidate.status === 'accepted' && styles.disabledButton,
                ]}
                onPress={() => acceptCandidate(candidate.id)}
              >
                <Text style={styles.accept}>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => rejectCandidate(candidate.id)}
              >
                <Text style={styles.reject}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.primaryButton} onPress={finishToHome}>
        <Text style={styles.primaryButtonText}>플레이스에 추가 · {acceptedCount}개 수락됨</Text>
      </TouchableOpacity>
      <Link href={'/plans/new' as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>플랜에 추가 · {acceptedCount}개 수락됨</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20, paddingTop: 32 },
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
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 12, padding: 12 },
    cardPreview: { flexDirection: 'row', gap: 12 },
    thumbnail: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 6,
      height: 84,
      width: 84,
    },
    cardContent: { flex: 1, gap: 8 },
    cardTitle: { color: theme.semantic.text, fontSize: 17, fontWeight: '800' },
    cardMeta: { color: theme.semantic.textMuted },
    pending: { color: theme.semantic.placeholder, fontWeight: '700' },
    accepted: { color: theme.semantic.success, fontWeight: '800' },
    actions: { flexDirection: 'row', gap: 12 },
    smallButton: { backgroundColor: theme.semantic.input, borderRadius: 8, flex: 1, padding: 10 },
    disabledButton: { opacity: 0.45 },
    accept: { color: theme.semantic.success, fontWeight: '800', textAlign: 'center' },
    reject: { color: theme.semantic.danger, fontWeight: '800', textAlign: 'center' },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 15 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    secondaryButton: { backgroundColor: theme.semantic.surfaceMuted, borderRadius: 8, padding: 15 },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '800', textAlign: 'center' },
  });
