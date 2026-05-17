import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function CommunityPostDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <DevScreenHeader screenName="커뮤니티 포스트 상세" screenNumber="S-11A" />
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, flex: 1, gap: 14, padding: 20 },
    title: { color: theme.semantic.text, fontSize: 22, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 22 },
    tagCard: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 14 },
    tagText: { color: theme.semantic.text, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    divider: { backgroundColor: theme.semantic.mediaPlaceholder, height: 1 },
    sectionTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    comment: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      padding: 12,
    },
    input: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      marginTop: 'auto',
      padding: 14,
    },
    placeholder: { color: theme.semantic.placeholder },
  });
