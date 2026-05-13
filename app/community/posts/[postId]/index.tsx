import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CommunityPostDetailScreen() {
  return (
    <View style={styles.container}>
      {/*
        화면: 커뮤니티 포스트 상세 (S-11A)
        기능: 포스트 본문, 태그된 장소/플랜, 좋아요/공유, 댓글 목록과 댓글 입력을 제공한다.
        가능한 다음 이동 화면: S-05, S-09
      */}
      <Text style={styles.title}>여행자 민</Text>
      <Text style={styles.body}>도쿄 3박 4일 동선이 좋아서 공유합니다.</Text>
      <Link href={'/plans/draft-plan/share' as Href} asChild>
        <TouchableOpacity style={styles.tagCard}>
          <Text style={styles.tagText}>태그된 플랜 · 도쿄 여름 여행</Text>
        </TouchableOpacity>
      </Link>
      <Text style={styles.meta}>좋아요 24 · 댓글 6</Text>
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>댓글</Text>
      <Text style={styles.comment}>좋은 코스예요!</Text>
      <View style={styles.input}>
        <Text style={styles.placeholder}>댓글 입력</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 14, padding: 20 },
  title: { color: '#111827', fontSize: 22, fontWeight: '800' },
  body: { color: '#374151', lineHeight: 22 },
  tagCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14 },
  tagText: { color: '#111827', fontWeight: '800' },
  meta: { color: '#6B7280' },
  divider: { backgroundColor: '#E5E7EB', height: 1 },
  sectionTitle: { color: '#111827', fontSize: 18, fontWeight: '800' },
  comment: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    color: '#374151',
    overflow: 'hidden',
    padding: 12,
  },
  input: { backgroundColor: '#FFFFFF', borderRadius: 8, marginTop: 'auto', padding: 14 },
  placeholder: { color: '#9CA3AF' },
});
