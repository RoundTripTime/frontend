import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const recommendations = [
  { id: 'osaka-castle', name: '오사카 성', category: '관광명소', country: '일본' },
  { id: 'jeju-cafe', name: '제주 바다 카페', category: '카페', country: '한국' },
  { id: 'danang-resort', name: '다낭 리조트', category: '숙박', country: '베트남' },
];

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 둘러보기 (S-10)
        기능: 카테고리와 국가 필터로 취향 기반 추천 장소를 탐색하고 저장한다.
        가능한 다음 이동 화면: S-05
      */}
      <Text style={styles.title}>둘러보기</Text>
      <Text style={styles.sectionLabel}>지금 인기있는 장소</Text>
      <View style={styles.chips}>
        {['전체', '관광명소', '맛집', '카페', '숙박', '한국', '일본', '동남아'].map((label) => (
          <Text key={label} style={styles.chip}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {recommendations.map((place) => (
          <Link key={place.id} href={`/places/${place.id}` as Href} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.thumbnail} />
              <Text style={styles.cardTitle}>{place.name}</Text>
              <Text style={styles.cardMeta}>
                {place.category} · {place.country}
              </Text>
              <Text style={styles.save}>저장</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 18, padding: 20, paddingTop: 64 },
  title: { color: '#111827', fontSize: 30, fontWeight: '800' },
  sectionLabel: { color: '#EA580C', fontSize: 14, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    color: '#374151',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 12, width: '48%' },
  thumbnail: { backgroundColor: '#E5E7EB', borderRadius: 6, height: 96 },
  cardTitle: { color: '#111827', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#6B7280', fontSize: 13 },
  save: { color: '#EA580C', fontWeight: '800' },
});
