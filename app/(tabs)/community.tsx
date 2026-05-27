import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCommunityPostsQuery } from '@/src/api/community/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { FeedSkeleton } from '@/src/components/LoadingSkeleton';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useMinimumLoading } from '@/src/hooks/useMinimumLoading';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function CommunityScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const postsQuery = useCommunityPostsQuery();
  const isInitialLoading = useMinimumLoading(postsQuery.isPending && !postsQuery.data);
  const posts = postsQuery.data?.items ?? [];
  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => postsQuery.refetch()}
    >
      <DevScreenHeader screenName="커뮤니티" screenNumber="S-11" />
      {/*
        화면: 커뮤니티 (S-11)
        기능: 피드 탭과 플랜 마켓 탭을 제공하고 포스트 카드에서 상세 화면으로 이동한다.
        가능한 다음 이동 화면: S-11A, S-11M, S-05, S-09
      */}
      <Text style={styles.title}>커뮤니티</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
      >
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
      </ScrollView>
      {isInitialLoading ? (
        <FeedSkeleton />
      ) : (
        posts.map((post) => (
          <Link key={post.post_id} href={`/community/posts/${post.post_id}` as Href} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.avatar} />
              <Text style={styles.author}>{post.author.nickname}</Text>
              <Text style={styles.body}>{post.content}</Text>
              {post.tagged_itinerary ? (
                <View style={styles.tagCard}>
                  <Text style={styles.tagTitle}>태그된 플랜 · {post.tagged_itinerary.title}</Text>
                </View>
              ) : null}
              <Text style={styles.meta}>
                좋아요 {post.like_count} · 댓글 {post.comment_count}
              </Text>
            </TouchableOpacity>
          </Link>
        ))
      )}
      {!isInitialLoading && posts.length === 0 ? (
        <Text style={styles.meta}>아직 커뮤니티 글이 없습니다.</Text>
      ) : null}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>글쓰기</Text>
      </TouchableOpacity>
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 16, padding: 20, paddingTop: 64 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    title: { color: theme.semantic.text, fontSize: 34, fontWeight: '900' },
    chips: { flexDirection: 'row', gap: 8, paddingRight: 20 },
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
