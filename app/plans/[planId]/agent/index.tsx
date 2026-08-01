import { Link, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlanningAgentScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { planId } = useLocalSearchParams<{ planId: string }>();

  return (
    <View style={styles.container}>
      <DevScreenHeader screenName="Planning Agent 대화" screenNumber="S-08" />
      {/*
        화면: Planning Agent 대화 (S-08)
        기능: 자연어 입력, 빠른 제안 칩, Agent 응답 카드, 플랜 반영 액션을 제공한다.
        가능한 다음 이동 화면: S-07
      */}
      <Text style={styles.title}>Planning Agent</Text>
      <View style={styles.messages}>
        <Text style={styles.message}>동선 최적화해줘</Text>
        <Text style={styles.agentCard}>Day 2 카페와 디저트 장소 순서를 바꾸는 제안</Text>
      </View>
      <View style={styles.chips}>
        {['동선 최적화해줘', '비슷한 카페 찾아줘', '2일차 비워줘'].map((chip) => (
          <Text key={chip} style={styles.chip}>
            {chip}
          </Text>
        ))}
      </View>
      <View style={styles.input}>
        <Text style={styles.placeholder}>메시지 입력</Text>
      </View>
      <Link href={`/plans/${planId ?? 'draft-plan'}` as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>플랜에 반영</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, flex: 1, gap: 14, padding: 20 },
    title: { color: theme.semantic.text, fontSize: 26, fontWeight: '800' },
    messages: { flex: 1, gap: 12 },
    message: {
      alignSelf: 'flex-end',
      backgroundColor: theme.semantic.primary,
      borderRadius: 8,
      color: theme.semantic.onPrimary,
      overflow: 'hidden',
      padding: 12,
    },
    agentCard: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      color: theme.semantic.text,
      overflow: 'hidden',
      padding: 14,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    input: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 14 },
    placeholder: { color: theme.semantic.placeholder },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 15 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
  });
