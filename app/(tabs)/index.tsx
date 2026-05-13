import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const places = [
  { id: 'tokyo-cafe', name: '도쿄 감성 카페', category: '카페', country: '일본' },
  { id: 'seoul-bistro', name: '성수 비스트로', category: '맛집', country: '한국' },
  { id: 'bangkok-night', name: '방콕 야시장', category: '관광명소', country: '태국' },
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 홈 / 내 장소 (S-02)
        기능: 플레이스 탭별 저장 장소 탐색, 장소 상세 진입, 최근 추가 장소 토스트 진입점을 제공한다.
        가능한 다음 이동 화면: S-04, S-05
      */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>내 장소</Text>
          <Text style={styles.title}>홈</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chips}>
        {['전체', '일본', '한국', '동남아'].map((label, index) => (
          <Text key={label} style={[styles.chip, index === 0 && styles.activeChip]}>
            {label}
          </Text>
        ))}
      </View>

      <Link href={'/places/recent' as Href} asChild>
        <TouchableOpacity style={styles.toast}>
          <Text style={styles.toastText}>📍 도쿄 맛집 VLOG에서 장소 3곳이 추가됐어요</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.grid}>
        {places.map((place) => (
          <Link key={place.id} href={`/places/${place.id}` as Href} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.thumbnail} />
              <Text style={styles.cardTitle}>{place.name}</Text>
              <Text style={styles.cardMeta}>
                {place.category} · {place.country}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, padding: 20, paddingTop: 64 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: '#6B7280', fontSize: 13 },
  title: { color: '#111827', fontSize: 30, fontWeight: '800' },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    color: '#374151',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  activeChip: { backgroundColor: '#FFEDD5', color: '#C2410C', fontWeight: '700' },
  toast: { backgroundColor: '#FFF7ED', borderRadius: 8, padding: 14 },
  toastText: { color: '#9A3412', fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 12, width: '48%' },
  thumbnail: { backgroundColor: '#E5E7EB', borderRadius: 6, height: 96 },
  cardTitle: { color: '#111827', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#6B7280', fontSize: 13 },
});
