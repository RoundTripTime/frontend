import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCommunityPostsQuery } from '@/src/api/community/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { EmptyState } from '@/src/components/EmptyState';
import {
  ScreenBody,
  ScreenControls,
  ScreenHeader,
  ScreenOverlay,
  ScreenRoot,
  ScreenScroll,
} from '@/src/components/layout';
import { FeedSkeleton } from '@/src/components/LoadingSkeleton';
import { AppChip } from '@/src/components/ui';
import { useMinimumLoading } from '@/src/hooks/useMinimumLoading';
import { useAppTheme, type AppTheme } from '@/src/theme';

type FeedType = 'all' | 'following';

const feedTabs: { feed?: FeedType; label: string }[] = [
  { feed: 'all', label: '전체' },
  { feed: 'following', label: '팔로잉' },
  { label: '플랜 마켓' },
];

function formatPostDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export default function CommunityScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [selectedFeed, setSelectedFeed] = useState<FeedType>('all');
  const postsQuery = useCommunityPostsQuery({ feed: selectedFeed });
  const isInitialLoading = useMinimumLoading(postsQuery.isPending && !postsQuery.data);
  const posts = postsQuery.data?.items ?? [];
  const emptyTitle =
    selectedFeed === 'following' ? '팔로잉 피드에 글이 없습니다.' : '아직 커뮤니티 글이 없습니다.';

  return (
    <ScreenRoot>
      <ScreenScroll
        applyBottomInset
        contentContainerStyle={styles.container}
        insetSpacing={theme.spacing.xxl * 2}
        onRefresh={() => postsQuery.refetch()}
      >
        <ScreenHeader
          meta={<DevScreenHeader screenName="커뮤니티" screenNumber="S-11" />}
          title="커뮤니티"
        />
        {/*
          화면: 커뮤니티 (S-11)
          기능: 피드 탭과 플랜 마켓 탭을 제공하고 포스트 카드에서 상세 화면으로 이동한다.
          가능한 다음 이동 화면: S-11A, S-11M, S-05, S-09
        */}
        <ScreenControls contentContainerStyle={styles.chips}>
          {feedTabs.map((tab) =>
            tab.label === '플랜 마켓' ? (
              <Link key={tab.label} href={'/community/market' as Href} asChild>
                <AppChip>{tab.label}</AppChip>
              </Link>
            ) : (
              <AppChip
                key={tab.label}
                selected={selectedFeed === tab.feed}
                onPress={() => {
                  setSelectedFeed(tab.feed ?? 'all');
                }}
              >
                {tab.label}
              </AppChip>
            ),
          )}
        </ScreenControls>
        <ScreenBody style={styles.feedBody}>
          {isInitialLoading ? (
            <FeedSkeleton />
          ) : (
            posts.map((post) => (
              <Link key={post.post_id} href={`/community/posts/${post.post_id}` as Href} asChild>
                <TouchableOpacity style={styles.card}>
                  <View style={styles.cardHeader}>
                    {post.author.avatar_url ? (
                      <Image source={{ uri: post.author.avatar_url }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatar} />
                    )}
                    <Text numberOfLines={1} style={styles.author}>
                      {post.author.nickname}
                    </Text>
                  </View>
                  <Text ellipsizeMode="tail" numberOfLines={2} style={styles.body}>
                    {post.content}
                  </Text>
                  {post.tagged_places.length > 0 ? (
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.tagRow}
                      showsHorizontalScrollIndicator={false}
                    >
                      {post.tagged_places.map((place) => (
                        <Text key={place.place_id} style={styles.placeTag}>
                          #{place.canonical_name}
                        </Text>
                      ))}
                    </ScrollView>
                  ) : null}
                  <View style={styles.cardFooter}>
                    <View style={styles.reactionFrame}>
                      <View style={styles.reactionItem}>
                        <Ionicons
                          color={post.is_liked ? theme.semantic.danger : theme.semantic.textMuted}
                          name={post.is_liked ? 'heart' : 'heart-outline'}
                          size={17}
                        />
                        <Text style={styles.meta}>{post.like_count}</Text>
                      </View>
                      <View style={styles.reactionItem}>
                        <Ionicons
                          color={theme.semantic.textMuted}
                          name="chatbubble-outline"
                          size={16}
                        />
                        <Text style={styles.meta}>{post.comment_count}</Text>
                      </View>
                    </View>
                    <View style={styles.dateFrame}>
                      <Text style={styles.meta}>{formatPostDate(post.created_at)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          )}
          {!isInitialLoading && posts.length === 0 ? (
            <EmptyState description="새 글이 올라오면 이곳에 표시됩니다." title={emptyTitle} />
          ) : null}
        </ScreenBody>
      </ScreenScroll>
      <ScreenOverlay applyBottomInset style={styles.fabOverlay}>
        <Link href={'/community/posts/new' as Href} asChild>
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabText}>글쓰기</Text>
          </TouchableOpacity>
        </Link>
      </ScreenOverlay>
    </ScreenRoot>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl * 2,
    },
    chips: { flexDirection: 'row', gap: theme.spacing.sm, paddingRight: theme.spacing.lg },
    feedBody: { gap: theme.spacing.lg },
    card: {
      backgroundColor: theme.semantic.surface,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    cardFooter: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    avatar: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 18,
      height: 36,
      width: 36,
    },
    author: { color: theme.semantic.text, flex: 1, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 20 },
    dateFrame: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    placeTag: { color: theme.semantic.textMuted, fontSize: 14, fontWeight: '800' },
    reactionFrame: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    reactionItem: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    tagRow: { gap: theme.spacing.sm, paddingRight: theme.spacing.lg },
    meta: { color: theme.semantic.textMuted },
    fabOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: theme.spacing.lg,
      pointerEvents: 'box-none',
    },
    fab: {
      alignSelf: 'flex-end',
      backgroundColor: theme.semantic.primary,
      borderRadius: theme.radius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    fabText: { color: theme.semantic.onPrimary, fontWeight: '800' },
  });
