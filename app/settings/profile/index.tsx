import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { userKeys, useUpdateMeMutation } from '@/src/api/users/hooks';
import { Avatar } from '@/src/components/Avatar';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { ScreenHeader, ScreenRoot, ScreenScroll } from '@/src/components/layout';
import { queryClient } from '@/src/lib/queryClient';
import { useAuthStore } from '@/src/stores/auth';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function ProfileEditScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const syncUserProfile = useAuthStore((state) => state.syncUserProfile);
  const updateMeMutation = useUpdateMeMutation();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');
  const isSaving = updateMeMutation.isPending;

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('권한 필요', '프로필 이미지를 선택하려면 사진 접근 권한이 필요해요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0]?.uri ?? '');
    }
  };

  const handleSave = async () => {
    const nextNickname = nickname.trim();
    const nextAvatarUrl = avatarUrl.trim();

    if (!nextNickname) {
      Alert.alert('닉네임 확인', '닉네임을 입력해주세요.');
      return;
    }

    try {
      const updatedProfile = await updateMeMutation.mutateAsync({
        avatar_url: nextAvatarUrl,
        nickname: nextNickname,
      });

      syncUserProfile(updatedProfile);
      await queryClient.invalidateQueries({ queryKey: userKeys.me });
      router.back();
    } catch {
      Alert.alert('저장 실패', '프로필을 저장하지 못했어요.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      style={styles.root}
    >
      <ScreenRoot>
        <ScreenScroll
          applyBottomInset
          contentContainerStyle={styles.container}
          scrollProps={{ keyboardShouldPersistTaps: 'handled' }}
        >
          <ScreenHeader
            meta={<DevScreenHeader screenName="프로필 수정" screenNumber="S-12-P" />}
            title="프로필"
          />
          {/*
          화면: 프로필 수정 (S-12-P)
          기능: 닉네임과 프로필 이미지 URL을 수정하고 PATCH /users/me 응답을 현재 세션에 반영한다.
          가능한 다음 이동 화면: 없음
        */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>이미지</Text>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.imageButton}
              onPress={() => {
                void handlePickImage();
              }}
            >
              <Avatar size={104} uri={avatarUrl} />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              autoCapitalize="none"
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor={theme.semantic.textMuted}
              style={styles.input}
              value={nickname}
            />
          </View>
          <View style={styles.actionGroup}>
            <TouchableOpacity
              disabled={isSaving}
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={() => {
                void handleSave();
              }}
            >
              <Text style={styles.saveButtonText}>{isSaving ? '저장 중' : '저장'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isSaving}
              style={styles.cancelButton}
              onPress={() => {
                router.back();
              }}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </ScreenScroll>
      </ScreenRoot>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    actionGroup: { gap: 10, marginTop: 8 },
    avatar: { borderRadius: 40, height: 80, width: 80 },
    cancelButton: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      padding: 16,
    },
    cancelButtonText: {
      color: theme.semantic.textSecondary,
      fontWeight: '900',
      textAlign: 'center',
    },
    container: { gap: 16, padding: 20 },
    disabledButton: { opacity: 0.5 },
    fieldGroup: { gap: 8 },
    imageButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderColor: theme.semantic.border,
      borderRadius: 52,
      borderWidth: 1,
      height: 104,
      justifyContent: 'center',
      overflow: 'hidden',
      width: 104,
    },
    input: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      color: theme.semantic.text,
      fontSize: 16,
      fontWeight: '700',
      padding: 14,
    },
    label: { color: theme.semantic.textSecondary, fontSize: 14, fontWeight: '900' },
    root: { backgroundColor: theme.semantic.background, flex: 1 },
    saveButton: {
      backgroundColor: theme.semantic.primary,
      borderRadius: 8,
      marginTop: 8,
      padding: 16,
    },
    saveButtonText: { color: theme.semantic.onPrimary, fontWeight: '900', textAlign: 'center' },
    title: { color: theme.semantic.text, fontSize: 34, fontWeight: '900' },
  });
