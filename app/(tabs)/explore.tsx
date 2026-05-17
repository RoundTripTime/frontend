import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

const recommendations = [
  { id: 'osaka-castle', name: '오사카 성', category: '관광명소', country: '일본' },
  { id: 'jeju-cafe', name: '제주 바다 카페', category: '카페', country: '한국' },
  { id: 'danang-resort', name: '다낭 리조트', category: '숙박', country: '베트남' },
];

export default function ExploreScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="둘러보기" screenNumber="S-10" />
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 18, padding: 20, paddingTop: 64 },
    title: { color: theme.semantic.text, fontSize: 30, fontWeight: '800' },
    sectionLabel: { color: theme.semantic.primary, fontSize: 14, fontWeight: '700' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: {
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      gap: 8,
      padding: 12,
      width: '48%',
    },
    thumbnail: { backgroundColor: theme.semantic.mediaPlaceholder, borderRadius: 6, height: 96 },
    cardTitle: { color: theme.semantic.text, fontSize: 16, fontWeight: '700' },
    cardMeta: { color: theme.semantic.textMuted, fontSize: 13 },
    save: { color: theme.semantic.primary, fontWeight: '800' },
  });
