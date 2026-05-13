import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CommunityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 커뮤니티 (S-11)
        기능: 피드 탭과 플랜 마켓 탭을 제공하고 포스트 카드에서 상세 화면으로 이동한다.
        가능한 다음 이동 화면: S-11A, S-11M, S-05, S-09
      */}
      <Text style={styles.title}>커뮤니티</Text>
      <View style={styles.chips}>
        {['전체', '팔로잉', '플랜 마켓'].map((label, index) =>
          label === '플랜 마켓' ? (
            <Link key={label} href={'/community/market' as Href} asChild>
              <TouchableOpacity>
                <Text style={[styles.chip, index === 2 && styles.activeChip]}>{label}</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Text key={label} style={styles.chip}>
              {label}
            </Text>
          ),
        )}
      </View>
      <Link href={'/community/posts/sample-post' as Href} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.avatar} />
          <Text style={styles.author}>여행자 민</Text>
          <Text style={styles.body}>도쿄 3박 4일 동선이 좋아서 공유합니다.</Text>
          <View style={styles.tagCard}>
            <Text style={styles.tagTitle}>태그된 플랜 · 도쿄 여름 여행</Text>
          </View>
          <Text style={styles.meta}>좋아요 24 · 댓글 6</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>글쓰기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 20, paddingTop: 64 },
  title: { color: '#111827', fontSize: 30, fontWeight: '800' },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    color: '#374151',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  activeChip: { backgroundColor: '#FFEDD5', color: '#C2410C', fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 16 },
  avatar: { backgroundColor: '#E5E7EB', borderRadius: 18, height: 36, width: 36 },
  author: { color: '#111827', fontWeight: '800' },
  body: { color: '#374151', lineHeight: 20 },
  tagCard: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 },
  tagTitle: { color: '#111827', fontWeight: '700' },
  meta: { color: '#6B7280' },
  fab: {
    alignSelf: 'flex-end',
    backgroundColor: '#EA580C',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  fabText: { color: '#FFFFFF', fontWeight: '800' },
});
