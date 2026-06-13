import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { communityKeys, useCreateCommunityPostMutation } from '@/src/api/community/hooks';
import { useMeQuery } from '@/src/api/users/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { ScreenBody, ScreenHeader, ScreenRoot, ScreenScroll } from '@/src/components/layout';
import { useAppTheme, type AppTheme } from '@/src/theme';

type PostVisibility = 'followers' | 'public';

const MAX_POST_LENGTH = 1000;

export default function NewCommunityPostScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const queryClient = useQueryClient();
  const createPostMutation = useCreateCommunityPostMutation();
  const meQuery = useMeQuery();
  const [content, setContent] = useState('');
  const user = meQuery.data;
  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !createPostMutation.isPending;

  const submitPost = async (_visibility: PostVisibility) => {
    if (!canSubmit) {
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        content: trimmedContent,
      });
      await queryClient.invalidateQueries({ queryKey: communityKeys.feeds() });
      await queryClient.invalidateQueries({ queryKey: communityKeys.posts({ feed: 'all' }) });
      await queryClient.invalidateQueries({
        queryKey: communityKeys.posts({ feed: 'following' }),
      });
      router.back();
    } catch {
      Alert.alert('글 등록 실패', '글을 등록하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const chooseVisibility = () => {
    if (!canSubmit) {
      return;
    }

    Alert.alert('공개 범위 선택', '이 글을 누구에게 공개할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '팔로워 공개',
        onPress: () => {
          void submitPost('followers');
        },
      },
      {
        text: '전체 공개',
        onPress: () => {
          void submitPost('public');
        },
      },
    ]);
  };

  return (
    <ScreenRoot style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardHost}
      >
        <ScreenScroll applyBottomInset contentContainerStyle={styles.container}>
          <ScreenHeader
            action={
              <TouchableOpacity
                activeOpacity={0.84}
                disabled={!canSubmit}
                onPress={chooseVisibility}
                style={[styles.doneButton, !canSubmit && styles.disabledButton]}
              >
                {createPostMutation.isPending ? (
                  <ActivityIndicator color={theme.semantic.onPrimary} size="small" />
                ) : (
                  <Text style={styles.doneButtonText}>완료</Text>
                )}
              </TouchableOpacity>
            }
            meta={<DevScreenHeader screenName="커뮤니티 글쓰기" screenNumber="S-11W" />}
            title="글쓰기"
          />
          {/*
            화면: 커뮤니티 글쓰기 (S-11W)
            기능: 커뮤니티 포스트 본문을 작성하고 공개 범위 선택 후 등록한다.
            가능한 다음 이동 화면: S-11
          */}
          <ScreenBody style={styles.body}>
            <View style={styles.editorCard}>
              <View style={styles.editorHeader}>
                {user?.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatar}>
                    <Ionicons color={theme.semantic.textMuted} name="person" size={18} />
                  </View>
                )}
                <Text numberOfLines={1} style={styles.editorAuthor}>
                  {user?.nickname ?? '사용자'}
                </Text>
              </View>
              <TextInput
                multiline
                maxLength={MAX_POST_LENGTH}
                onChangeText={setContent}
                placeholder="여행 이야기를 공유해보세요."
                placeholderTextColor={theme.semantic.placeholder}
                scrollEnabled
                style={styles.editorInput}
                textAlignVertical="top"
                value={content}
              />
              <Text style={styles.counter}>
                {content.length}/{MAX_POST_LENGTH}
              </Text>
            </View>
          </ScreenBody>
        </ScreenScroll>
      </KeyboardAvoidingView>
    </ScreenRoot>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    avatar: {
      alignItems: 'center',
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 18,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    body: { gap: theme.spacing.lg },
    container: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    counter: {
      color: theme.semantic.textMuted,
      fontSize: theme.typography.size.label,
      fontWeight: '700',
      textAlign: 'right',
    },
    disabledButton: { opacity: 0.45 },
    doneButton: {
      alignItems: 'center',
      backgroundColor: theme.semantic.primary,
      borderRadius: theme.radius.md,
      justifyContent: 'center',
      minWidth: 64,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    doneButtonText: {
      color: theme.semantic.onPrimary,
      fontSize: theme.typography.size.label,
      fontWeight: '900',
    },
    editorAuthor: { color: theme.semantic.text, flex: 1, fontWeight: '800' },
    editorCard: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    editorHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    editorInput: {
      color: theme.semantic.text,
      fontSize: theme.typography.size.body,
      height: 180,
      lineHeight: 22,
      padding: 0,
    },
    keyboardHost: { flex: 1 },
    screen: { flex: 1 },
  });
