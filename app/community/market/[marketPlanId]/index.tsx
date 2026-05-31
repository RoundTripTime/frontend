import { Link, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useMarketPlanPreviewQuery } from '@/src/api/market/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function MarketPlanDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { marketPlanId } = useLocalSearchParams<{ marketPlanId: string }>();
  const previewQuery = useMarketPlanPreviewQuery(marketPlanId ?? '');
  const preview = previewQuery.data;
  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => previewQuery.refetch()}
    >
      <DevScreenHeader screenName="플랜 마켓 상세 / 미리보기 / 열람" screenNumber="S-11MP" />
      {/*
        화면: 플랜 마켓 상세 / 미리보기 / 열람 (S-11MP)
        기능: 무료 미리보기, 크레딧 열람, 잠금 영역, 전체 일정, 내 플랜 복사 액션을 제공한다.
        가능한 다음 이동 화면: S-05, S-07, S-11MAD
      */}
      {previewQuery.isLoading ? (
        <Text style={styles.body}>마켓 플랜을 불러오는 중입니다.</Text>
      ) : null}
      {preview ? (
        <>
          <Text style={styles.title}>{preview.title}</Text>
          <Text style={styles.meta}>
            {preview.destination_region} · {preview.duration_nights}박 · {preview.party_size}명 ·{' '}
            {preview.author.nickname}
          </Text>
          <Text style={styles.badge}>✈️ 실제 다녀온 플랜 인증</Text>
          <Text style={styles.body}>{preview.description}</Text>
          <View style={styles.preview}>
            <Text style={styles.sectionTitle}>미리보기 장소</Text>
            {preview.preview_places.map((place) => (
              <Text key={place.place_id} style={styles.place}>
                {place.canonical_name}
              </Text>
            ))}
          </View>
          <View style={styles.locked}>
            <Text style={styles.lockedText}>
              + {preview.hidden_place_count}개 장소가 숨겨져 있어요
            </Text>
          </View>
          <Link href={`/community/market/${preview.market_plan_id}/credits` as Href} asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                💎 {preview.credit_price} 크레딧으로 열기
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href={'/plans/draft-plan' as Href} asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>내 플랜으로 복사하기</Text>
            </TouchableOpacity>
          </Link>
        </>
      ) : null}
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
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
