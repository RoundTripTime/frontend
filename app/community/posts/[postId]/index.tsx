import { Link, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCommunityCommentsQuery, useCommunityPostQuery } from '@/src/api/community/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function CommunityPostDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const postQuery = useCommunityPostQuery(postId ?? '');
  const commentsQuery = useCommunityCommentsQuery(postId ?? '');
  const post = postQuery.data;
  const comments = commentsQuery.data?.items ?? [];
  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => Promise.all([postQuery.refetch(), commentsQuery.refetch()])}
    >
      <DevScreenHeader screenName="커뮤니티 포스트 상세" screenNumber="S-11A" />
      {/*
        화면: 커뮤니티 포스트 상세 (S-11A)
        기능: 포스트 본문, 태그된 장소/플랜, 좋아요/공유, 댓글 목록과 댓글 입력을 제공한다.
        가능한 다음 이동 화면: S-05, S-09
      */}
      {postQuery.isLoading ? <Text style={styles.body}>포스트를 불러오는 중입니다.</Text> : null}
      {post ? (
        <>
          <Text style={styles.title}>{post.author.nickname}</Text>
          <Text style={styles.body}>{post.content}</Text>
          {post.tagged_itinerary ? (
            <Link href={`/plans/${post.tagged_itinerary.itinerary_id}/share` as Href} asChild>
              <TouchableOpacity style={styles.tagCard}>
                <Text style={styles.tagText}>태그된 플랜 · {post.tagged_itinerary.title}</Text>
              </TouchableOpacity>
            </Link>
          ) : null}
          <Text style={styles.meta}>
            좋아요 {post.like_count} · 댓글 {post.comment_count}
          </Text>
        </>
      ) : null}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>댓글</Text>
      {comments.map((comment) => (
        <Text key={comment.comment_id} style={styles.comment}>
          {comment.content}
        </Text>
      ))}
      {!commentsQuery.isLoading && comments.length === 0 ? (
        <Text style={styles.meta}>아직 댓글이 없습니다.</Text>
      ) : null}
      <View style={styles.input}>
        <Text style={styles.placeholder}>댓글 입력</Text>
      </View>
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, flexGrow: 1, gap: 14, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    title: { color: theme.semantic.text, fontSize: 22, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 22 },
    tagCard: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 14 },
    tagText: { color: theme.semantic.text, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    divider: { backgroundColor: theme.semantic.mediaPlaceholder, height: 1 },
    sectionTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    comment: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      padding: 12,
    },
    input: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      marginTop: 'auto',
      padding: 14,
    },
    placeholder: { color: theme.semantic.placeholder },
  });
