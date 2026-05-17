import { Link, router, type Href } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function ShareReceiveScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <DevScreenHeader screenName="링크 수신 / 분석 중" screenNumber="S-03" />
      {/*
        화면: 링크 수신 / 분석 중 (S-03)
        기능: 공유된 링크 분석이 백그라운드에서 시작되었음을 안내하고 홈으로 자동 복귀한다.
        가능한 다음 이동 화면: S-02, S-04
      */}
      <View style={styles.preview}>
        <View style={styles.previewThumb} />
        <View style={styles.previewCopy}>
          <Text style={styles.platform}>YouTube</Text>
          <Text style={styles.url}>https://example.com/travel-vlog</Text>
        </View>
      </View>
      <ActivityIndicator color={theme.semantic.primary} size="large" />
      <Text style={styles.message}>장소를 찾고 있어요. 잠시 후 알려드릴게요.</Text>
      <Link href={'/' as Href} style={styles.link}>
        앱으로 돌아가기
      </Link>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.semantic.background,
      alignItems: 'center',
      flex: 1,
      gap: 22,
      justifyContent: 'center',
      padding: 20,
    },
    preview: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 12,
      padding: 16,
      width: '100%',
    },
    previewThumb: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 6,
      height: 54,
      width: 54,
    },
    previewCopy: { flex: 1, gap: 6 },
    platform: { color: theme.semantic.primary, fontWeight: '800' },
    url: { color: theme.semantic.textSecondary },
    message: { color: theme.semantic.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
    link: { color: theme.semantic.textMuted, fontWeight: '700' },
  });
