import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { userKeys, useMeQuery, useUpdateMeMutation } from '@/src/api/users/hooks';
import { Avatar } from '@/src/components/Avatar';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { queryClient } from '@/src/lib/queryClient';
import { useAuthStore } from '@/src/stores/auth';
import { useAppTheme, type AppTheme } from '@/src/theme';

import type { MapProvider } from '@/src/api/users/types';

const mapProviderOptions: { label: string; value: MapProvider }[] = [
  { label: 'Kakao', value: 'kakao' },
  { label: 'Google', value: 'google' },
];

export default function SettingsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const syncUserProfile = useAuthStore((state) => state.syncUserProfile);
  const logout = useAuthStore((state) => state.logout);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const meQuery = useMeQuery();
  const updateMeMutation = useUpdateMeMutation();
  const [mapSelectOpen, setMapSelectOpen] = useState(false);
  const selectedMapProvider = meQuery.data?.map_provider ?? 'kakao';
  const selectedMapProviderLabel =
    mapProviderOptions.find((option) => option.value === selectedMapProvider)?.label ?? 'Kakao';

  const updateMapProvider = async (mapProvider: MapProvider) => {
    if (mapProvider === selectedMapProvider || updateMeMutation.isPending) {
      return;
    }

    try {
      const updatedProfile = await updateMeMutation.mutateAsync({ map_provider: mapProvider });
      syncUserProfile(updatedProfile);
      queryClient.setQueryData(userKeys.me, updatedProfile);
      setMapSelectOpen(false);
    } catch {
      Alert.alert('설정 실패', '지도 공급자를 변경하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="설정" screenNumber="S-12" />
      {/*
        화면: 설정 (S-12)
        기능: 프로필, 계정 정보, 알림, 지도 공급자, 로그아웃과 계정 삭제 설정을 관리한다.
        가능한 다음 이동 화면: S-12-P
      */}
      <Text style={styles.title}>설정</Text>
      <TouchableOpacity
        activeOpacity={0.84}
        style={styles.profile}
        onPress={() => {
          router.push('/settings/profile' as Href);
        }}
      >
        <Avatar size={56} uri={user?.avatar_url} />
        <View style={styles.profileText}>
          <Text style={styles.nickname}>{user?.nickname ?? '이상한 여우 8237'}</Text>
          <Text style={styles.email}>{user?.email ?? 'user@example.com'}</Text>
        </View>
        <Ionicons color={theme.semantic.textMuted} name="chevron-forward" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>알림 설정</Text>
      </TouchableOpacity>
      <View style={styles.selectRow}>
        <Text style={styles.settingLabel}>지도 공급자</Text>
        <View style={styles.selectWrap}>
          <TouchableOpacity
            activeOpacity={0.84}
            disabled={updateMeMutation.isPending}
            style={styles.selectButton}
            onPress={() => {
              setMapSelectOpen((current) => !current);
            }}
          >
            <Text style={styles.selectText}>{selectedMapProviderLabel}</Text>
            <Ionicons
              color={theme.semantic.textMuted}
              name={mapSelectOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
            />
          </TouchableOpacity>
          {mapSelectOpen ? (
            <View style={styles.selectMenu}>
              {mapProviderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  disabled={updateMeMutation.isPending}
                  style={styles.selectOption}
                  onPress={() => {
                    void updateMapProvider(option.value);
                  }}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      selectedMapProvider === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          void logout();
        }}
      >
        <Text style={styles.rowText}>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          void deleteAccount();
        }}
      >
        <Text style={styles.dangerText}>계정 삭제</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 12, padding: 20 },
    title: { color: theme.semantic.text, fontSize: 34, fontWeight: '900' },
    profile: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 14,
      justifyContent: 'space-between',
      padding: 16,
      width: '100%',
    },
    profileText: { flex: 1, gap: 4 },
    nickname: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    email: { color: theme.semantic.textMuted },
    row: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 16 },
    rowText: { color: theme.semantic.text, fontWeight: '700' },
    dangerText: { color: theme.semantic.danger, fontWeight: '800' },
    selectButton: {
      alignItems: 'center',
      borderColor: theme.semantic.borderStrong,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'space-between',
      minWidth: 132,
      paddingHorizontal: 12,
      paddingVertical: 9,
    },
    selectedOptionText: { color: theme.semantic.primary, fontWeight: '900' },
    selectMenu: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 6,
      borderWidth: 1,
      marginTop: 6,
      overflow: 'hidden',
      position: 'absolute',
      right: 0,
      top: 40,
      width: 132,
      zIndex: 2,
    },
    selectOption: { paddingHorizontal: 12, paddingVertical: 10 },
    selectOptionText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    selectRow: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
    },
    selectText: { color: theme.semantic.text, fontWeight: '800' },
    selectWrap: {
      position: 'relative',
      zIndex: 2,
    },
    settingLabel: { color: theme.semantic.text, fontWeight: '800' },
  });
