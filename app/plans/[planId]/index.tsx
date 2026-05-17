import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlanEditScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="플랜 상세 / 편집" screenNumber="S-07" />
      {/*
        화면: 플랜 상세 / 편집 (S-07)
        기능: 여행 정보, 일자별 장소 배치, 미배치 장소 풀, Agent, 지도, 공유, OTA 예약, 저장 액션을 제공한다.
        가능한 다음 이동 화면: S-05, S-07-M, S-08, S-09
      */}
      <Text style={styles.title}>도쿄 여름 여행</Text>
      <Text style={styles.meta}>일본 · 2026.07.01 ~ 2026.07.04 · 2명</Text>
      <View style={styles.actions}>
        <Link href={'/plans/draft-plan/map' as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>지도</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/plans/draft-plan/agent' as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>Agent</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/plans/draft-plan/share' as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>공유</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {['Day 1', 'Day 2', '미배치 장소'].map((day) => (
        <View key={day} style={styles.section}>
          <Text style={styles.sectionTitle}>{day}</Text>
          <Text style={styles.place}>도쿄 감성 카페 · 예상 이동 15분</Text>
        </View>
      ))}
      <View style={styles.ota}>
        <Text style={styles.sectionTitle}>OTA 예약</Text>
        <Text style={styles.place}>숙소 예약 · 항공 예약</Text>
      </View>
      <Link href={'/plans/draft-plan/share' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>저장</Text>
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
    ota: { backgroundColor: theme.semantic.primarySoft, borderRadius: 8, gap: 8, padding: 14 },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 16 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
  });
