import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function MarketPlanDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="플랜 마켓 상세 / 미리보기 / 열람" screenNumber="S-11MP" />
      {/*
        화면: 플랜 마켓 상세 / 미리보기 / 열람 (S-11MP)
        기능: 무료 미리보기, 크레딧 열람, 잠금 영역, 전체 일정, 내 플랜 복사 액션을 제공한다.
        가능한 다음 이동 화면: S-05, S-07, S-11MAD
      */}
      <Text style={styles.title}>도쿄 3박 4일 실제 다녀온 플랜</Text>
      <Text style={styles.meta}>일본 · 3박 4일 · 2명 · 여행자 민</Text>
      <Text style={styles.badge}>✈️ 실제 다녀온 플랜 인증</Text>
      <Text style={styles.body}>카페와 맛집 중심으로 이동 시간을 줄인 플랜입니다.</Text>
      <View style={styles.preview}>
        <Text style={styles.sectionTitle}>미리보기 장소</Text>
        <Text style={styles.place}>도쿄 감성 카페</Text>
      </View>
      <View style={styles.locked}>
        <Text style={styles.lockedText}>+ 7개 장소가 숨겨져 있어요</Text>
      </View>
      <Link href={'/community/market/sample-market-plan/credits' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>💎 1 크레딧으로 열기</Text>
        </TouchableOpacity>
      </Link>
      <Link href={'/plans/draft-plan' as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>내 플랜으로 복사하기</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20, paddingTop: 32 },
    title: { color: theme.semantic.text, fontSize: 26, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    badge: { color: theme.semantic.primary, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 22 },
    preview: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    sectionTitle: { color: theme.semantic.text, fontWeight: '800' },
    place: { color: theme.semantic.textSecondary },
    locked: {
      alignItems: 'center',
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 8,
      height: 120,
      justifyContent: 'center',
    },
    lockedText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 15 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    secondaryButton: { backgroundColor: theme.semantic.surfaceMuted, borderRadius: 8, padding: 15 },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '800', textAlign: 'center' },
  });
