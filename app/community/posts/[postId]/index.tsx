import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type KeyboardEvent,
} from 'react-native';

import {
  communityKeys,
  useCommunityCommentsQuery,
  useCommunityPostQuery,
  useCreateCommunityCommentMutation,
  useDeleteCommunityCommentMutation,
} from '@/src/api/community/hooks';
import { Avatar } from '@/src/components/Avatar';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import {
  ScreenBody,
  ScreenFooter,
  ScreenHeader,
  ScreenOverlay,
  ScreenRoot,
  ScreenScroll,
} from '@/src/components/layout';
import { usePostLike } from '@/src/features/community/hooks/usePostLike';
import { queryClient } from '@/src/lib/queryClient';
import { useAuthStore } from '@/src/stores/auth';
import { useAppTheme, type AppTheme } from '@/src/theme';

import type { CommunityComment } from '@/src/api/community/types';

const ANDROID_KEYBOARD_ACCESSORY_GAP = 44;

export default function CommunityPostDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const postQuery = useCommunityPostQuery(postId ?? '');
  const commentsQuery = useCommunityCommentsQuery(postId ?? '');
  const createCommentMutation = useCreateCommunityCommentMutation(postId ?? '');
  const deleteCommentMutation = useDeleteCommunityCommentMutation(postId ?? '');
  const user = useAuthStore((state) => state.user);
  const [commentContent, setCommentContent] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const lastTapAtRef = useRef(0);
  const post = postQuery.data;
  const postLike = usePostLike({
    initialIsLiked: post?.is_liked,
    initialLikeCount: post?.like_count,
    postId,
  });
  const comments = [...(commentsQuery.data?.items ?? [])].sort(
    (left, right) => Date.parse(left.created_at) - Date.parse(right.created_at),
  );

  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };
    const handleKeyboardHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };
    const didShowSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const didHideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      didShowSubscription.remove();
      didHideSubscription.remove();
    };
  }, []);

  const keyboardAccessoryGap =
    keyboardVisible && Platform.OS === 'android' ? ANDROID_KEYBOARD_ACCESSORY_GAP : 0;
  const footerKeyboardOffset = keyboardHeight + keyboardAccessoryGap;

  const refreshComments = async () => {
    if (!postId) {
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(postId) }),
      queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) }),
    ]);
  };

  const handleSubmitComment = async () => {
    const content = commentContent.trim();

    if (!postId) {
      return;
    }

    if (!content) {
      Alert.alert('댓글 확인', '댓글을 입력해주세요.');
      return;
    }

    if (content.length > 300) {
      Alert.alert('댓글 확인', '댓글은 최대 300자까지 입력할 수 있어요.');
      return;
    }

    try {
      await createCommentMutation.mutateAsync({ content });
      setCommentContent('');
      await refreshComments();
    } catch {
      Alert.alert('댓글 작성 실패', '댓글을 등록하지 못했어요.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) {
      return;
    }

    try {
      await deleteCommentMutation.mutateAsync(commentId);
      await refreshComments();
    } catch (error) {
      Alert.alert(
        '삭제 실패',
        error instanceof Error ? error.message : '댓글을 삭제하지 못했어요.',
      );
    }
  };

  const handleLongPressComment = (comment: CommunityComment) => {
    if (comment.author.user_id !== user?.id) {
      return;
    }

    Alert.alert('댓글 삭제', '댓글을 삭제할까요?', [
      { style: 'cancel', text: '취소' },
      {
        onPress: () => {
          void handleDeleteComment(comment.comment_id);
        },
        style: 'destructive',
        text: '삭제',
      },
    ]);
  };

  const handleContentPress = () => {
    if (keyboardVisible) {
      return;
    }

    const now = Date.now();

    if (now - lastTapAtRef.current < 280) {
      lastTapAtRef.current = 0;
      void postLike.like();
      return;
    }

    lastTapAtRef.current = now;
  };

  return (
    <ScreenRoot>
      <ScreenScroll
        applyBottomInset
        contentContainerStyle={[
          styles.container,
          { paddingBottom: footerHeight + footerKeyboardOffset + theme.spacing.lg },
        ]}
        onRefresh={() => Promise.all([postQuery.refetch(), commentsQuery.refetch()])}
        scrollProps={{ keyboardDismissMode: 'interactive' }}
      >
        <ScreenHeader
          meta={<DevScreenHeader screenName="커뮤니티 포스트 상세" screenNumber="S-11A" />}
          title="포스트"
        />
        {/*
          화면: 커뮤니티 포스트 상세 (S-11A)
          기능: 포스트 본문, 태그된 장소/플랜, 좋아요/공유, 댓글 목록과 댓글 입력을 제공한다.
          가능한 다음 이동 화면: S-05, S-09
        */}
        <ScreenBody style={styles.contentBody}>
          {postQuery.isLoading ? (
            <Text style={styles.body}>포스트를 불러오는 중입니다.</Text>
          ) : null}
          {post ? (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.postSection}
              onPress={handleContentPress}
            >
              <View style={styles.authorRow}>
                <Avatar size={36} uri={post.author.avatar_url} />
                <Text style={styles.authorName}>{post.author.nickname}</Text>
              </View>
              <Text style={styles.body}>{post.content}</Text>
              {post.tagged_places.length > 0 ? (
                <View style={styles.tagRow}>
                  {post.tagged_places.map((place) => (
                    <Text key={place.place_id} style={styles.placeTag}>
                      #{place.canonical_name}
                    </Text>
                  ))}
                </View>
              ) : null}
              <View style={styles.reactionRow}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  disabled={postLike.isPending}
                  style={styles.reactionItem}
                  onPress={() => {
                    void postLike.toggleLike();
                  }}
                >
                  <Ionicons
                    color={postLike.isLiked ? theme.semantic.danger : theme.semantic.textMuted}
                    name={postLike.isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                  />
                  <Text
                    style={[styles.reactionText, postLike.isLiked && styles.activeReactionText]}
                  >
                    {postLike.likeCount}
                  </Text>
                </TouchableOpacity>
                <View style={styles.reactionItem}>
                  <Ionicons color={theme.semantic.textMuted} name="chatbubble-outline" size={17} />
                  <Text style={styles.reactionText}>{post.comment_count}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>댓글</Text>
          {comments.map((comment) => (
            <TouchableOpacity
              key={comment.comment_id}
              activeOpacity={0.82}
              delayLongPress={350}
              style={styles.comment}
              onPress={handleContentPress}
              onLongPress={() => {
                handleLongPressComment(comment);
              }}
            >
              <View style={styles.commentAuthorRow}>
                <Avatar size={28} uri={comment.author.avatar_url} />
                <Text style={styles.commentAuthor}>{comment.author.nickname}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </TouchableOpacity>
          ))}
          {!commentsQuery.isLoading && comments.length === 0 ? (
            <Text style={styles.meta}>아직 댓글이 없습니다.</Text>
          ) : null}
        </ScreenBody>
      </ScreenScroll>
      <ScreenOverlay
        pointerEvents="box-none"
        style={[styles.footerOverlay, { bottom: footerKeyboardOffset }]}
      >
        <View
          onLayout={(event) => {
            setFooterHeight(event.nativeEvent.layout.height);
          }}
        >
          <ScreenFooter
            applyBottomInset={!keyboardVisible}
            insetSpacing={theme.spacing.md}
            style={styles.commentComposer}
          >
            <TextInput
              multiline
              onChangeText={setCommentContent}
              placeholder="댓글 입력"
              placeholderTextColor={theme.semantic.placeholder}
              style={styles.commentInput}
              value={commentContent}
            />
            <TouchableOpacity
              disabled={createCommentMutation.isPending}
              style={[
                styles.submitButton,
                createCommentMutation.isPending && styles.disabledButton,
              ]}
              onPress={() => {
                void handleSubmitComment();
              }}
            >
              <Text style={styles.submitButtonText}>
                {createCommentMutation.isPending ? '등록 중' : '등록'}
              </Text>
            </TouchableOpacity>
          </ScreenFooter>
        </View>
      </ScreenOverlay>
    </ScreenRoot>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    activeReactionText: { color: theme.semantic.danger },
    comment: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      gap: 8,
      padding: 12,
    },
    commentAuthorRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
    commentAuthor: { color: theme.semantic.text, fontWeight: '800' },
    commentComposer: {
      alignItems: 'flex-end',
      backgroundColor: theme.semantic.background,
      borderTopColor: theme.semantic.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      gap: 10,
      padding: 12,
    },
    commentContent: { color: theme.semantic.textSecondary, lineHeight: 20 },
    commentInput: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      color: theme.semantic.text,
      flex: 1,
      maxHeight: 96,
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    container: {
      backgroundColor: theme.semantic.background,
      flexGrow: 1,
      gap: 14,
      padding: 20,
    },
    contentBody: { gap: 14 },
    authorName: { color: theme.semantic.text, fontSize: 15, fontWeight: '900' },
    authorRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
    body: {
      color: theme.semantic.text,
      fontSize: theme.typography.size.body,
      fontWeight: theme.typography.weight.medium,
      lineHeight: theme.typography.lineHeight.body,
    },
    placeTag: { color: theme.semantic.textMuted, fontSize: 14, fontWeight: '800' },
    postSection: { gap: 14 },
    reactionItem: { alignItems: 'center', flexDirection: 'row', gap: 5 },
    reactionRow: { flexDirection: 'row', gap: 16 },
    reactionText: { color: theme.semantic.textMuted, fontWeight: '800' },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    meta: { color: theme.semantic.textMuted },
    divider: { backgroundColor: theme.semantic.mediaPlaceholder, height: 1 },
    sectionTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    disabledButton: { opacity: 0.5 },
    footerOverlay: {
      justifyContent: 'flex-end',
    },
    submitButton: {
      backgroundColor: theme.semantic.primary,
      borderRadius: 8,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: 16,
    },
    submitButtonText: { color: theme.semantic.onPrimary, fontWeight: '900' },
  });
