import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { createPlanListItemViewModel } from '@/src/features/plans/viewModel';
import { mockItineraries } from '@/src/mocks/fixtures';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlansScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const plans = mockItineraries.map(createPlanListItemViewModel);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="플랜 목록" screenNumber="S-06" />
      {/*
        화면: 플랜 목록 (S-06)
        기능: 진행 중이거나 완성된 여행 플랜을 목록으로 관리하고 새 플랜 생성을 시작한다.
        가능한 다음 이동 화면: S-06N, S-07
      */}
      <View style={styles.header}>
        <Text style={styles.title}>내 플랜</Text>
      </View>
      {plans.map((plan) => (
        <Link key={plan.id} href={`/plans/${plan.id}` as Href} asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{plan.title}</Text>
              <Text style={styles.badge}>{plan.visibilityLabel}</Text>
            </View>
            <Text style={styles.cardMeta}>{plan.meta}</Text>
            <Text style={styles.status}>{plan.statusLabel}</Text>
          </TouchableOpacity>
        </Link>
      ))}
      <Link href={'/plans/new' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>+ 새 플랜 만들기</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 16, padding: 20, paddingTop: 64 },
    header: { gap: 12 },
    title: { color: theme.semantic.text, fontSize: 30, fontWeight: '800' },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 14 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 16 },
    cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    cardTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    badge: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 14,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    cardMeta: { color: theme.semantic.textMuted },
    status: { color: theme.semantic.primary, fontWeight: '700' },
  });
