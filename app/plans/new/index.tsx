import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NewPlanScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 새 플랜 만들기 (S-06N)
        기능: 기본 정보 입력과 장소 선택 2단계 플로우로 플랜 생성 후 편집 화면으로 이동한다.
        가능한 다음 이동 화면: S-07
      */}
      <Text style={styles.step}>● ○</Text>
      <Text style={styles.title}>기본 정보</Text>
      {['플랜 이름', '여행지', '날짜 범위', '인원'].map((label) => (
        <View key={label} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.placeholder}>입력 또는 선택</Text>
        </View>
      ))}
      <Text style={styles.step}>● ●</Text>
      <Text style={styles.title}>장소 선택</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>전체 선택 / 해제</Text>
        <Text style={styles.cardMeta}>내 저장 장소 리스트에서 다중 선택</Text>
      </View>
      <Link href={'/plans/draft-plan' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>플랜 만들기 · 3개 선택됨</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, padding: 20, paddingTop: 32 },
  step: { color: '#EA580C', fontSize: 18, fontWeight: '900' },
  title: { color: '#111827', fontSize: 24, fontWeight: '800' },
  field: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 14 },
  label: { color: '#111827', fontWeight: '800' },
  placeholder: { color: '#9CA3AF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 6, padding: 14 },
  cardTitle: { color: '#111827', fontWeight: '800' },
  cardMeta: { color: '#6B7280' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
});
