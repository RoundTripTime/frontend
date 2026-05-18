import { Link, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { createPlanDetailViewModel } from '@/src/features/plans/viewModel';
import { mockItineraryDetail } from '@/src/mocks/fixtures';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlanShareScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const currentPlanId = planId ?? mockItineraryDetail.itinerary_id;
  const plan = createPlanDetailViewModel({ ...mockItineraryDetail, itinerary_id: currentPlanId });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="플랜 공유 / 상세" screenNumber="S-09" />
      {/*
        화면: 플랜 공유 / 상세 (S-09)
        기능: 완성된 플랜 요약, 읽기 전용 일정, 지도 전체 보기, 공유와 편집 액션을 제공한다.
        가능한 다음 이동 화면: S-07
      */}
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.meta}>
        {plan.dateRangeLabel} · {plan.partyLabel} · 장소 {plan.placeCount}개
      </Text>
      <View style={styles.map}>
        <Text style={styles.mapText}>지도 전체 보기</Text>
      </View>
      {plan.days.map((day) => (
        <View key={day.dayIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{day.title}</Text>
          {day.items.map((item) => (
            <Text key={item.itemId} style={styles.place}>
              {item.name}
            </Text>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>공유</Text>
      </TouchableOpacity>
      <Link href={`/plans/${plan.id}` as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>편집</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20, paddingTop: 32 },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    map: {
      alignItems: 'center',
      backgroundColor: theme.semantic.borderStrong,
      borderRadius: 8,
      height: 160,
      justifyContent: 'center',
    },
    mapText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    section: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    sectionTitle: { color: theme.semantic.text, fontWeight: '800' },
    place: { color: theme.semantic.textSecondary },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 15 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    secondaryButton: { backgroundColor: theme.semantic.surfaceMuted, borderRadius: 8, padding: 15 },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '800', textAlign: 'center' },
  });
