import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const candidates = ['츠키지 라멘', '긴자 카페', '시부야 디저트'];

export default function RecentPlacesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 최근 추가한 장소 (S-04)
        기능: 분석 완료된 장소 후보를 확인하고 수락/거절 후 플레이스 또는 플랜에 추가한다.
        가능한 다음 이동 화면: S-02, S-05, S-07
      */}
      <View style={styles.source}>
        <Text style={styles.sourceTitle}>도쿄 맛집 VLOG</Text>
        <Text style={styles.sourceUrl}>https://example.com/tokyo-food</Text>
      </View>
      {candidates.map((name) => (
        <Link key={name} href={`/places/${name}` as Href} asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.thumbnail} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardMeta}>맛집 · 일본</Text>
              <View style={styles.actions}>
                <Text style={styles.accept}>수락</Text>
                <Text style={styles.reject}>거절</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>플레이스에 추가</Text>
      </TouchableOpacity>
      <Link href={'/plans/new' as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>플랜에 추가</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, padding: 20, paddingTop: 32 },
  source: { backgroundColor: '#FFF7ED', borderRadius: 8, gap: 6, padding: 14 },
  sourceTitle: { color: '#9A3412', fontWeight: '800' },
  sourceUrl: { color: '#9A3412' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, flexDirection: 'row', gap: 12, padding: 12 },
  thumbnail: { backgroundColor: '#E5E7EB', borderRadius: 6, height: 84, width: 84 },
  cardContent: { flex: 1, gap: 8 },
  cardTitle: { color: '#111827', fontSize: 17, fontWeight: '800' },
  cardMeta: { color: '#6B7280' },
  actions: { flexDirection: 'row', gap: 12 },
  accept: { color: '#16A34A', fontWeight: '800' },
  reject: { color: '#DC2626', fontWeight: '800' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 15 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  secondaryButton: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 15 },
  secondaryButtonText: { color: '#111827', fontWeight: '800', textAlign: 'center' },
});
