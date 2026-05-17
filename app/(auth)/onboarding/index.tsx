import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAuthStore } from '@/src/stores/auth';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function OnboardingScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const isLoading = status === 'checking';

  const handleLogin = async (provider: 'google' | 'kakao') => {
    await login(provider);
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="온보딩" screenNumber="S-01" />
      {/*
        화면: 온보딩 (S-01)
        기능: 여행 영감 저장, 장소 자동 추출, 일정 생성 및 예약 가치를 소개하고 소셜 로그인을 유도한다.
        가능한 다음 이동 화면: S-02
      */}
      <Text style={styles.title}>여행 영감을 바로 일정으로</Text>
      {['여행 영감 저장', '장소 자동 추출', '일정 생성 및 예약'].map((copy, index) => (
        <View key={copy} style={styles.slide}>
          <Text style={styles.slideIndex}>{index + 1}</Text>
          <Text style={styles.slideTitle}>{copy}</Text>
        </View>
      ))}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity
        disabled={isLoading}
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={() => {
          void handleLogin('google');
        }}
      >
        <Text style={styles.primaryButtonText}>Google로 시작하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={isLoading}
        style={[styles.secondaryButton, isLoading && styles.disabledButton]}
        onPress={() => {
          void handleLogin('kakao');
        }}
      >
        <Text style={styles.secondaryButtonText}>Kakao로 시작하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 16, padding: 20, paddingTop: 64 },
    title: { color: theme.semantic.text, fontSize: 30, fontWeight: '800' },
    slide: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 10, padding: 18 },
    slideIndex: { color: theme.semantic.primary, fontSize: 18, fontWeight: '800' },
    slideTitle: { color: theme.semantic.text, fontSize: 20, fontWeight: '800' },
    primaryButton: {
      backgroundColor: theme.semantic.primaryDeep,
      borderRadius: 8,
      marginTop: 12,
      padding: 16,
    },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    secondaryButton: { backgroundColor: theme.semantic.kakao, borderRadius: 8, padding: 16 },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '800', textAlign: 'center' },
    disabledButton: { opacity: 0.5 },
    error: { color: theme.semantic.danger, fontWeight: '700' },
  });
