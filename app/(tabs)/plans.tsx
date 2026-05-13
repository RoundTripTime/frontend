import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const plans = [
  {
    id: 'tokyo-summer',
    title: '도쿄 여름 여행',
    meta: '일본 · 3박 4일 · 2명',
    status: '초안',
    open: '비공개',
  },
  {
    id: 'seoul-weekend',
    title: '서울 주말 미식',
    meta: '한국 · 1박 2일 · 3명',
    status: '확정',
    open: '공개',
  },
];

export default function PlansScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 플랜 목록 (S-06)
        기능: 진행 중이거나 완성된 여행 플랜을 목록으로 관리하고 새 플랜 생성을 시작한다.
        가능한 다음 이동 화면: S-06N, S-07
      */}
      <View style={styles.header}>
        <Text style={styles.title}>플랜</Text>
        <Link href={'/plans/new' as Href} asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>새 플랜 만들기</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {plans.map((plan) => (
        <Link key={plan.id} href={`/plans/${plan.id}` as Href} asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{plan.title}</Text>
              <Text style={styles.badge}>{plan.open}</Text>
            </View>
            <Text style={styles.cardMeta}>{plan.meta}</Text>
            <Text style={styles.status}>{plan.status}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 20, paddingTop: 64 },
  header: { gap: 12 },
  title: { color: '#111827', fontSize: 30, fontWeight: '800' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 14 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 16 },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { color: '#111827', fontSize: 18, fontWeight: '800' },
  badge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    color: '#374151',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardMeta: { color: '#6B7280' },
  status: { color: '#EA580C', fontWeight: '700' },
});
