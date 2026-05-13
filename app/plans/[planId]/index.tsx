import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlanEditScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 플랜 상세 / 편집 (S-07)
        기능: 여행 정보, 일자별 장소 배치, 미배치 장소 풀, Agent, 지도, 공유, OTA 예약, 저장 액션을 제공한다.
        가능한 다음 이동 화면: S-05, S-07-M, S-08, S-09
      */}
      <Text style={styles.title}>도쿄 여름 여행</Text>
      <Text style={styles.meta}>일본 · 2026.07.01 ~ 2026.07.04 · 2명</Text>
      <View style={styles.actions}>
        <Link href={'/plans/draft-plan/map' as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>지도</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/plans/draft-plan/agent' as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>Agent</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/plans/draft-plan/share' as Href} asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>공유</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {['Day 1', 'Day 2', '미배치 장소'].map((day) => (
        <View key={day} style={styles.section}>
          <Text style={styles.sectionTitle}>{day}</Text>
          <Text style={styles.place}>도쿄 감성 카페 · 예상 이동 15분</Text>
        </View>
      ))}
      <View style={styles.ota}>
        <Text style={styles.sectionTitle}>OTA 예약</Text>
        <Text style={styles.place}>숙소 예약 · 항공 예약</Text>
      </View>
      <Link href={'/plans/draft-plan/share' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>저장</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, padding: 20, paddingTop: 32 },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  meta: { color: '#6B7280' },
  actions: { flexDirection: 'row', gap: 8 },
  action: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionText: { color: '#111827', fontWeight: '800' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 10, padding: 14 },
  sectionTitle: { color: '#111827', fontSize: 17, fontWeight: '800' },
  place: { color: '#374151' },
  ota: { backgroundColor: '#FFF7ED', borderRadius: 8, gap: 8, padding: 14 },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
});
