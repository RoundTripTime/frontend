import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function CommunityScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="커뮤니티" screenNumber="S-11" />
      {/*
        화면: 커뮤니티 (S-11)
        기능: 피드 탭과 플랜 마켓 탭을 제공하고 포스트 카드에서 상세 화면으로 이동한다.
        가능한 다음 이동 화면: S-11A, S-11M, S-05, S-09
      */}
      <Text style={styles.title}>커뮤니티</Text>
      <View style={styles.chips}>
        {['전체', '팔로잉', '플랜 마켓'].map((label, index) =>
          label === '플랜 마켓' ? (
            <Link key={label} href={'/community/market' as Href} asChild>
              <TouchableOpacity>
                <Text style={[styles.chip, index === 2 && styles.activeChip]}>{label}</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Text key={label} style={styles.chip}>
              {label}
            </Text>
          ),
        )}
      </View>
      <Link href={'/community/posts/sample-post' as Href} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.avatar} />
          <Text style={styles.author}>여행자 민</Text>
          <Text style={styles.body}>도쿄 3박 4일 동선이 좋아서 공유합니다.</Text>
          <View style={styles.tagCard}>
            <Text style={styles.tagTitle}>태그된 플랜 · 도쿄 여름 여행</Text>
          </View>
          <Text style={styles.meta}>좋아요 24 · 댓글 6</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>글쓰기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 16, padding: 20, paddingTop: 64 },
    title: { color: theme.semantic.text, fontSize: 30, fontWeight: '800' },
    chips: { flexDirection: 'row', gap: 8 },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    activeChip: {
      backgroundColor: theme.semantic.primarySoft,
      color: theme.semantic.primaryDeep,
      fontWeight: '700',
    },
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 16 },
    avatar: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 18,
      height: 36,
      width: 36,
    },
    author: { color: theme.semantic.text, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 20 },
    tagCard: { backgroundColor: theme.semantic.input, borderRadius: 8, padding: 12 },
    tagTitle: { color: theme.semantic.text, fontWeight: '700' },
    meta: { color: theme.semantic.textMuted },
    fab: {
      alignSelf: 'flex-end',
      backgroundColor: theme.semantic.primary,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    fabText: { color: theme.semantic.onPrimary, fontWeight: '800' },
  });
