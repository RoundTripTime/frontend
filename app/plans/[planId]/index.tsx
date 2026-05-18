import { Link, Stack, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { createPlanDetailViewModel } from '@/src/features/plans/viewModel';
import { mockItineraryDetail } from '@/src/mocks/fixtures';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlanEditScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const currentPlanId = planId ?? mockItineraryDetail.itinerary_id;
  const plan = createPlanDetailViewModel({ ...mockItineraryDetail, itinerary_id: currentPlanId });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href={`/plans/${plan.id}/share` as Href} asChild>
              <TouchableOpacity>
                <Text style={styles.headerAction}>공유</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <DevScreenHeader screenName="플랜 상세 / 편집" screenNumber="S-07" />
      {/*
        화면: 플랜 상세 / 편집 (S-07)
        기능: 여행 정보, 일자별 장소 배치, 미배치 장소 풀, Agent, 지도, 공유, OTA 예약, 저장 액션을 제공한다.
        가능한 다음 이동 화면: S-05, S-07-M, S-08, S-09
      */}
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.meta}>{plan.meta}</Text>
      <View style={styles.actions}>
        <Link href={`/plans/${plan.id}/map` as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>지도</Text>
          </TouchableOpacity>
        </Link>
        <Link href={`/plans/${plan.id}/agent` as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>Agent</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {plan.days.map((day) => (
        <View key={day.dayIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{day.title}</Text>
          {day.items.map((item) => (
            <Text key={item.itemId} style={styles.place}>
              {item.name} · {item.durationLabel}
            </Text>
          ))}
        </View>
      ))}
      {plan.unassignedItems.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>미배치 장소</Text>
          {plan.unassignedItems.map((item) => (
            <Text key={item.itemId} style={styles.place}>
              {item.name} · {item.durationLabel}
            </Text>
          ))}
        </View>
      ) : null}
      <Link href={`/plans/${plan.id}/share` as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>저장</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.bookingGrid}>
        <TouchableOpacity style={styles.bookingBlock}>
          <Text style={styles.sectionTitle}>숙소 예약</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookingBlock}>
          <Text style={styles.sectionTitle}>항공 예약</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20, paddingTop: 32 },
    headerAction: { color: theme.semantic.primary, fontSize: 16, fontWeight: '800' },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    actions: { flexDirection: 'row', gap: 8 },
    action: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    actionText: { color: theme.semantic.text, fontWeight: '800' },
    section: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 10, padding: 14 },
    sectionTitle: { color: theme.semantic.text, fontSize: 17, fontWeight: '800' },
    place: { color: theme.semantic.textSecondary },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 16 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    bookingGrid: { flexDirection: 'row', gap: 10 },
    bookingBlock: {
      alignItems: 'center',
      backgroundColor: theme.semantic.primarySoft,
      borderRadius: 8,
      flex: 1,
      gap: 8,
      justifyContent: 'center',
      padding: 14,
    },
  });
