import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { installGlobalHandlers } from '@/src/lib/globalHandlers';
import { installAuthInterceptors, useAuthStore } from '@/src/stores/auth';

installGlobalHandlers();
installAuthInterceptors();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((state) => state.status);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    if (status === 'idle') {
      void bootstrap();
    }
  }, [bootstrap, status]);

  useEffect(() => {
    if (status === 'idle' || status === 'checking') {
      return;
    }

    const isAuthRoute = segments[0] === '(auth)';

    if (status === 'unauthenticated' && !isAuthRoute) {
      router.replace('/(auth)/onboarding');
      return;
    }

    if (status === 'authenticated' && isAuthRoute) {
      router.replace('/');
    }
  }, [router, segments, status]);

  if (status === 'idle' || status === 'checking') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#EA580C" />
      </View>
    );
  }

  return (
    <>
      {/*
        화면: 앱 루트 레이아웃
        기능: 인증 상태에 따라 온보딩과 하단 탭을 분기하고 상세 화면 route stack을 제공한다.
        가능한 다음 이동 화면: S-01, S-02, S-03, S-04, S-05, S-06, S-07, S-07-M, S-08, S-09, S-10, S-11, S-11A, S-11M, S-11MP, S-11MAD, S-11MR, S-12
      */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/onboarding" options={{ title: '온보딩' }} />
        <Stack.Screen name="(share)/receive" options={{ title: '링크 수신' }} />
        <Stack.Screen name="places/recent" options={{ title: '최근 추가한 장소' }} />
        <Stack.Screen name="places/[placeId]" options={{ title: '장소 상세' }} />
        <Stack.Screen name="plans/new" options={{ title: '새 플랜 만들기' }} />
        <Stack.Screen name="plans/[planId]" options={{ title: '플랜 편집' }} />
        <Stack.Screen name="plans/[planId]/map" options={{ headerShown: false }} />
        <Stack.Screen name="plans/[planId]/agent" options={{ title: 'Planning Agent' }} />
        <Stack.Screen name="plans/[planId]/share" options={{ title: '플랜 공유' }} />
        <Stack.Screen name="community/posts/[postId]" options={{ title: '포스트 상세' }} />
        <Stack.Screen name="community/market/[marketPlanId]" options={{ title: '마켓 상세' }} />
        <Stack.Screen
          name="community/market/[marketPlanId]/credits"
          options={{ presentation: 'modal', title: '크레딧 충전' }}
        />
        <Stack.Screen name="community/market/register" options={{ title: '마켓 등록' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
