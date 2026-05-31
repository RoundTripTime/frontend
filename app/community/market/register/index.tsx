import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useItinerariesQuery } from '@/src/api/itineraries/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function MarketRegisterScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const plansQuery = useItinerariesQuery();
  const plan = plansQuery.data?.items[0];
  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => plansQuery.refetch()}
    >
      <DevScreenHeader screenName="플랜 마켓 등록" screenNumber="S-11MR" />
      {/*
        화면: 플랜 마켓 등록 (S-11MR)
        기능: OTA 예약 완료 플랜을 선택하고 제목, 소개, 장단점, 팁 입력 후 마켓에 등록한다.
        가능한 다음 이동 화면: S-11M
      */}
      <Text style={styles.title}>마켓 등록</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{plan?.title ?? '등록 가능한 플랜을 불러오는 중'}</Text>
        <Text style={styles.badge}>✈️ OTA 예약 완료</Text>
      </View>
      {['제목', '한 줄 소개', '소개', '좋았던 점', '아쉬웠던 점', '추가 팁'].map((field) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{field}</Text>
          <Text style={styles.placeholder}>입력</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>등록 완료</Text>
      </TouchableOpacity>
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    cardTitle: { color: theme.semantic.text, fontWeight: '800' },
    badge: { color: theme.semantic.primary, fontWeight: '800' },
    field: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    label: { color: theme.semantic.text, fontWeight: '800' },
    placeholder: { color: theme.semantic.placeholder },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 15 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
  });
