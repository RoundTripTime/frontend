import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlanningAgentScreen() {
  return (
    <View style={styles.container}>
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
      <Link href={'/plans/draft-plan' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>플랜에 반영</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 14, padding: 20 },
  title: { color: '#111827', fontSize: 26, fontWeight: '800' },
  messages: { flex: 1, gap: 12 },
  message: {
    alignSelf: 'flex-end',
    backgroundColor: '#EA580C',
    borderRadius: 8,
    color: '#FFFFFF',
    overflow: 'hidden',
    padding: 12,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    color: '#111827',
    overflow: 'hidden',
    padding: 14,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    color: '#374151',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14 },
  placeholder: { color: '#9CA3AF' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 15 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
});
