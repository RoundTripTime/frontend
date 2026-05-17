import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlanMapScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <DevScreenHeader screenName="플랜 지도 스플릿 뷰" screenNumber="S-07-M" />
      {/*
        화면: 플랜 지도 스플릿 뷰 (S-07-M)
        기능: 플랜 장소 마커를 전체화면 지도에 표시하고 하단 시트에서 Day별 일정을 함께 확인한다.
        가능한 다음 이동 화면: S-05, S-07
      */}
      <View style={styles.map}>
        <Text style={styles.mapText}>플랜 지도</Text>
      </View>
      <Link href={'/plans/draft-plan' as Href} asChild>
        <TouchableOpacity style={styles.close}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Day별 장소</Text>
        <Text style={styles.chip}>Day 1 · 도쿄 감성 카페</Text>
        <Text style={styles.chip}>Day 2 · 시부야 디저트</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, flex: 1 },
    map: {
      alignItems: 'center',
      backgroundColor: theme.semantic.borderStrong,
      flex: 1,
      justifyContent: 'center',
    },
    mapText: { color: theme.semantic.textSecondary, fontSize: 24, fontWeight: '800' },
    close: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 20,
      left: 20,
      padding: 10,
      position: 'absolute',
      top: 56,
    },
    closeText: { color: theme.semantic.text, fontWeight: '900' },
    sheet: {
      backgroundColor: theme.semantic.surface,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      bottom: 0,
      gap: 10,
      left: 0,
      padding: 18,
      position: 'absolute',
      right: 0,
    },
    sheetTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    chip: {
      backgroundColor: theme.semantic.primarySoft,
      borderRadius: 18,
      color: theme.semantic.primaryDeep,
      overflow: 'hidden',
      padding: 10,
    },
  });
