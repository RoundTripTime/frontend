import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useDiscoverPlacesQuery } from '@/src/api/places/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { EmptyState } from '@/src/components/EmptyState';
import { CardGridSkeleton } from '@/src/components/LoadingSkeleton';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { PlaceCard } from '@/src/features/places/components/PlaceCard';
import { getPlaceCountryLabel } from '@/src/features/places/viewModel';
import { useMinimumLoading } from '@/src/hooks/useMinimumLoading';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function ExploreScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const discoverQuery = useDiscoverPlacesQuery();
  const isInitialLoading = useMinimumLoading(discoverQuery.isPending && !discoverQuery.data);
  const recommendations = discoverQuery.data?.results ?? [];
  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => discoverQuery.refetch()}
    >
      <DevScreenHeader screenName="둘러보기" screenNumber="S-10" />
      {/*
        화면: 둘러보기 (S-10)
        기능: 카테고리와 국가 필터로 취향 기반 추천 장소를 탐색하고 저장한다.
        가능한 다음 이동 화면: S-05
      */}
      <Text style={styles.title}>둘러보기</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
      >
        {['전체', '관광명소', '맛집', '카페', '숙박', '한국', '일본', '동남아'].map((label) => (
          <Text key={label} style={styles.chip}>
            {label}
          </Text>
        ))}
      </ScrollView>
      {isInitialLoading ? (
        <CardGridSkeleton />
      ) : recommendations.length === 0 ? (
        <EmptyState
          description="새로운 추천 장소가 준비되면 이곳에 표시됩니다."
          title="아직 장소가 없습니다"
        />
      ) : (
        <View style={styles.grid}>
          {recommendations.map((place) => (
            <Link
              key={place.place_id}
              href={`/places/${place.place_id}?entry=explore` as Href}
              asChild
            >
              <PlaceCard
                category={place.category}
                countryLabel={getPlaceCountryLabel(place.country_code)}
                name={place.canonical_name}
              />
            </Link>
          ))}
        </View>
      )}
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 18, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    title: { color: theme.semantic.text, fontSize: 34, fontWeight: '900' },
    chips: { flexDirection: 'row', gap: 8, paddingRight: 20 },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  });
