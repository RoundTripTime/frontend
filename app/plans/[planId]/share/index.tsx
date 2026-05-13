import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlanShareScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 플랜 공유 / 상세 (S-09)
        기능: 완성된 플랜 요약, 읽기 전용 일정, 지도 전체 보기, 공유와 편집 액션을 제공한다.
        가능한 다음 이동 화면: S-07
      */}
      <Text style={styles.title}>도쿄 여름 여행</Text>
      <Text style={styles.meta}>3박 4일 · 2명 · 장소 8개</Text>
      <View style={styles.map}>
        <Text style={styles.mapText}>지도 전체 보기</Text>
      </View>
      {['Day 1', 'Day 2', 'Day 3'].map((day) => (
        <View key={day} style={styles.section}>
          <Text style={styles.sectionTitle}>{day}</Text>
          <Text style={styles.place}>도쿄 감성 카페</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>공유</Text>
      </TouchableOpacity>
      <Link href={'/plans/draft-plan' as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>편집</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, padding: 20, paddingTop: 32 },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  meta: { color: '#6B7280' },
  map: {
    alignItems: 'center',
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    height: 160,
    justifyContent: 'center',
  },
  mapText: { color: '#374151', fontWeight: '800' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 14 },
  sectionTitle: { color: '#111827', fontWeight: '800' },
  place: { color: '#374151' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 15 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  secondaryButton: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 15 },
  secondaryButtonText: { color: '#111827', fontWeight: '800', textAlign: 'center' },
});
