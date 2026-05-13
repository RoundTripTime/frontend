import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MarketListScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 플랜 마켓 목록 (S-11M)
        기능: 국가/정렬 필터로 등록된 플랜을 탐색하고 크레딧 잔액과 마켓 등록 진입점을 제공한다.
        가능한 다음 이동 화면: S-11MP, S-11MR
      */}
      <View style={styles.header}>
        <Text style={styles.title}>플랜 마켓</Text>
        <Text style={styles.credit}>💎 3</Text>
      </View>
      <View style={styles.chips}>
        {['전체', '일본', '한국', '동남아', '최신순', '인기순'].map((chip) => (
          <Text key={chip} style={styles.chip}>
            {chip}
          </Text>
        ))}
      </View>
      <Link href={'/community/market/sample-market-plan' as Href} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.thumbnail} />
          <Text style={styles.cardTitle}>도쿄 3박 4일 실제 다녀온 플랜</Text>
          <Text style={styles.cardMeta}>일본 · 3박 4일 · 2명 · 장소 8개 · 조회 128</Text>
          <Text style={styles.badge}>✈️ 실제 다녀온 플랜 · 💎 1</Text>
        </TouchableOpacity>
      </Link>
      <Link href={'/community/market/register' as Href} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>내 플랜 등록하기</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 20, paddingTop: 32 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  credit: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 14 },
  thumbnail: { backgroundColor: '#E5E7EB', borderRadius: 6, height: 140 },
  cardTitle: { color: '#111827', fontSize: 18, fontWeight: '800' },
  cardMeta: { color: '#6B7280' },
  badge: { color: '#EA580C', fontWeight: '800' },
  fab: {
    alignSelf: 'flex-end',
    backgroundColor: '#EA580C',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  fabText: { color: '#FFFFFF', fontWeight: '800' },
});
