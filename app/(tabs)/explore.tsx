import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useDiscoverPlacesQuery } from '@/src/api/places/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { EmptyState } from '@/src/components/EmptyState';
import {
  ScreenBody,
  ScreenControls,
  ScreenHeader,
  ScreenRoot,
  ScreenScroll,
} from '@/src/components/layout';
import { CardGridSkeleton } from '@/src/components/LoadingSkeleton';
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
    <ScreenRoot>
      <ScreenScroll
        applyBottomInset
        contentContainerStyle={styles.container}
        insetSpacing={theme.spacing.xxl}
        onRefresh={() => discoverQuery.refetch()}
      >
        <ScreenHeader
          meta={<DevScreenHeader screenName="둘러보기" screenNumber="S-10" />}
          title="둘러보기"
        />
        {/*
          화면: 둘러보기 (S-10)
          기능: 카테고리와 국가 필터로 취향 기반 추천 장소를 탐색하고 저장한다.
          가능한 다음 이동 화면: S-05
        */}
        <ScreenControls contentContainerStyle={styles.chips}>
          {['전체', '관광명소', '맛집', '카페', '숙박', '한국', '일본', '동남아'].map((label) => (
            <Text key={label} style={styles.chip}>
              {label}
            </Text>
          ))}
        </ScreenControls>
        <ScreenBody style={styles.body}>
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
        </ScreenBody>
      </ScreenScroll>
    </ScreenRoot>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.xs,
    },
    body: { gap: theme.spacing.sm },
    chips: { flexDirection: 'row', gap: theme.spacing.sm, paddingRight: theme.spacing.md },
    chip: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 14,
      color: theme.semantic.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      height: 28,
      lineHeight: 28,
      overflow: 'hidden',
      textAlign: 'center',
      width: 68,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
