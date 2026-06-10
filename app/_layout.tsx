import { DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '@/src/features/extraction/backgroundTask';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { ExtractionJobWatcher } from '@/src/features/extraction/ExtractionJobWatcher';
import { installGlobalHandlers } from '@/src/lib/globalHandlers';
import { queryClient } from '@/src/lib/queryClient';
import { installAuthInterceptors, useAuthStore } from '@/src/stores/auth';
import { appThemes } from '@/src/theme';

installGlobalHandlers();
installAuthInterceptors();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const appTheme = appThemes[colorScheme === 'dark' ? 'dark' : 'light'];
  const navigationTheme = useMemo<Theme>(
    () => ({
      ...DefaultTheme,
      dark: appTheme.colorScheme === 'dark',
      colors: {
        ...DefaultTheme.colors,
        background: appTheme.semantic.background,
        border: appTheme.semantic.border,
        card: appTheme.semantic.surface,
        notification: appTheme.semantic.primary,
        primary: appTheme.semantic.primary,
        text: appTheme.semantic.text,
      },
    }),
    [appTheme],
  );

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <View style={[styles.root, { backgroundColor: appTheme.semantic.background }]}>
            <ThemeProvider value={navigationTheme}>
              <QueryClientProvider client={queryClient}>
                <AuthGate />
                <ExtractionJobWatcher />
                <StatusBar style={appTheme.colorScheme === 'dark' ? 'dark' : 'auto'} />
              </QueryClientProvider>
            </ThemeProvider>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
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
        <ActivityIndicator color={appThemes.light.semantic.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        segments[0] === '(auth)'
          ? null
          : { paddingLeft: insets.left, paddingRight: insets.right, paddingTop: insets.top },
      ]}
    >
      {/*
        화면: 앱 루트 레이아웃
        기능: 인증 상태에 따라 온보딩과 하단 탭을 분기하고 상세 화면 route stack을 제공한다.
        가능한 다음 이동 화면: S-01, S-02, S-03, S-04, S-05, S-06, S-07, S-07-M, S-08, S-09, S-10, S-11, S-11A, S-11M, S-11MP, S-11MAD, S-11MR, S-12, S-12-P
      */}
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="(auth)/onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(share)/receive/index"
          options={{ headerShown: false, title: '링크 수신' }}
        />
        <Stack.Screen name="places/recent/index" options={{ headerShown: false }} />
        <Stack.Screen name="places/[placeId]/index" options={{ headerShown: false }} />
        <Stack.Screen name="plans/new/index" options={{ headerShown: false }} />
        <Stack.Screen name="plans/[planId]/index" options={{ headerShown: false }} />
        <Stack.Screen name="plans/[planId]/map/index" options={{ headerShown: false }} />
        <Stack.Screen name="plans/[planId]/agent/index" options={{ title: 'Planning Agent' }} />
        <Stack.Screen name="plans/[planId]/share/index" options={{ title: '플랜 공유' }} />
        <Stack.Screen name="community/posts/[postId]/index" options={{ headerShown: false }} />
        <Stack.Screen name="community/market/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="community/market/[marketPlanId]/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="community/market/[marketPlanId]/credits/index"
          options={{ presentation: 'modal', title: '크레딧 충전' }}
        />
        <Stack.Screen name="community/market/register/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/profile/index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
