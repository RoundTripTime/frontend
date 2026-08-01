import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCreditBalanceQuery } from '@/src/api/credits/hooks';
import { useMarketPlansQuery } from '@/src/api/market/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function MarketListScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const marketPlansQuery = useMarketPlansQuery();
  const creditQuery = useCreditBalanceQuery();
  const marketPlans = marketPlansQuery.data?.items ?? [];
  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => Promise.all([marketPlansQuery.refetch(), creditQuery.refetch()])}
    >
      <DevScreenHeader screenName="플랜 마켓 목록" screenNumber="S-11M" />
      {/*
        화면: 플랜 마켓 목록 (S-11M)
        기능: 국가/정렬 필터로 등록된 플랜을 탐색하고 크레딧 잔액과 마켓 등록 진입점을 제공한다.
        가능한 다음 이동 화면: S-11MP, S-11MR
      */}
      <View style={styles.header}>
        <Text style={styles.title}>플랜 마켓</Text>
        <Text style={styles.credit}>💎 {creditQuery.data?.balance ?? 0}</Text>
      </View>
      <View style={styles.chips}>
        {['전체', '일본', '한국', '동남아', '최신순', '인기순'].map((chip) => (
          <Text key={chip} style={styles.chip}>
            {chip}
          </Text>
        ))}
      </View>
      {marketPlansQuery.isLoading ? (
        <Text style={styles.cardMeta}>마켓 플랜을 불러오는 중입니다.</Text>
      ) : null}
      {marketPlans.map((plan) => (
        <Link
          key={plan.market_plan_id}
          href={`/community/market/${plan.market_plan_id}` as Href}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <View style={styles.thumbnail} />
            <Text style={styles.cardTitle}>{plan.title}</Text>
            <Text style={styles.cardMeta}>
              {plan.destination_region} · {plan.duration_nights}박 · {plan.party_size}명 · 장소{' '}
              {plan.place_count}개 · 조회 {plan.view_count}
            </Text>
            <Text style={styles.badge}>✈️ 실제 다녀온 플랜 · 💎 {plan.credit_price}</Text>
          </TouchableOpacity>
        </Link>
      ))}
      <Link href={'/community/market/register' as Href} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>내 플랜 등록하기</Text>
        </TouchableOpacity>
      </Link>
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 16, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    credit: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 16,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    thumbnail: { backgroundColor: theme.semantic.mediaPlaceholder, borderRadius: 6, height: 140 },
    cardTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    cardMeta: { color: theme.semantic.textMuted },
    badge: { color: theme.semantic.primary, fontWeight: '800' },
    fab: {
      alignSelf: 'flex-end',
      backgroundColor: theme.semantic.primary,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    fabText: { color: theme.semantic.onPrimary, fontWeight: '800' },
  });
