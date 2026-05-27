import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAuthStore } from '@/src/stores/auth';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="설정" screenNumber="S-12" />
      {/*
        화면: 설정 (S-12)
        기능: 프로필, 계정 정보, 알림, 지도 공급자, 로그아웃과 계정 삭제 설정을 관리한다.
        가능한 다음 이동 화면: 없음
      */}
      <Text style={styles.title}>설정</Text>
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <View style={styles.profileText}>
          <Text style={styles.nickname}>{user?.nickname ?? '이상한 여우 8237'}</Text>
          <Text style={styles.email}>{user?.email ?? 'user@example.com'}</Text>
        </View>
      </View>
      {['프로필 사진 변경', '닉네임 변경', '알림 설정', '지도 공급자: Kakao / Google'].map(
        (item) => (
          <TouchableOpacity key={item} style={styles.row}>
            <Text style={styles.rowText}>{item}</Text>
          </TouchableOpacity>
        ),
      )}
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
    container: { backgroundColor: theme.semantic.background, gap: 12, padding: 20, paddingTop: 64 },
    title: { color: theme.semantic.text, fontSize: 34, fontWeight: '900' },
    profile: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 14,
      padding: 16,
    },
    avatar: { backgroundColor: theme.semantic.accentSoft, borderRadius: 28, height: 56, width: 56 },
    profileText: { gap: 4 },
    nickname: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    email: { color: theme.semantic.textMuted },
    row: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 16 },
    rowText: { color: theme.semantic.text, fontWeight: '700' },
    dangerText: { color: theme.semantic.danger, fontWeight: '800' },
  });
