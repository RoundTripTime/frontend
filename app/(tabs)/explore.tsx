import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  collectionKeys,
  useAddCollectionPlaceMutation,
  useCollectionsQuery,
} from '@/src/api/collections/hooks';
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
import { AppChip } from '@/src/components/ui';
import { useRefreshLatestExtractionResult } from '@/src/features/extraction/useRefreshLatestExtractionResult';
import { PlaceCard } from '@/src/features/places/components/PlaceCard';
import {
  getPlaceCategoryLabel,
  getPlaceCategoryValue,
  getPlaceCountryLabel,
  placeCategoryFilterOptions,
  type PlaceCategoryFilterValue,
} from '@/src/features/places/viewModel';
import { useMinimumLoading } from '@/src/hooks/useMinimumLoading';
import { queryClient } from '@/src/lib/queryClient';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function ExploreScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategoryFilterValue>('all');
  const discoverParams = useMemo(
    () => ({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
    }),
    [selectedCategory],
  );
  const discoverQuery = useDiscoverPlacesQuery(discoverParams);
  const collectionsQuery = useCollectionsQuery();
  const defaultCollectionId =
    collectionsQuery.data?.items.find((collection) => collection.is_default)?.collection_id ??
    collectionsQuery.data?.items[0]?.collection_id ??
    '';
  const addCollectionPlaceMutation = useAddCollectionPlaceMutation(defaultCollectionId);
  const refreshLatestExtractionResult = useRefreshLatestExtractionResult();
  const isInitialLoading = useMinimumLoading(discoverQuery.isPending && !discoverQuery.data);
  const recommendations = discoverQuery.data?.results ?? [];
  const filteredRecommendations = useMemo(
    () =>
      recommendations.filter(
        (place) =>
          selectedCategory === 'all' || getPlaceCategoryValue(place.category) === selectedCategory,
      ),
    [recommendations, selectedCategory],
  );

  const savePlace = async (placeId: string) => {
    if (!defaultCollectionId) {
      Alert.alert('저장 실패', '저장할 플레이스를 찾지 못했어요.');
      return;
    }

    try {
      await addCollectionPlaceMutation.mutateAsync({ place_id: placeId });
      await queryClient.invalidateQueries({ queryKey: collectionKeys.places(defaultCollectionId) });
      Alert.alert('저장 완료', '내 플레이스에 추가했어요.');
    } catch {
      Alert.alert('저장 실패', '장소를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <ScreenRoot>
      <ScreenScroll
        applyBottomInset
        contentContainerStyle={styles.container}
        insetSpacing={theme.spacing.md}
        onRefresh={() => Promise.all([discoverQuery.refetch(), refreshLatestExtractionResult()])}
      >
        <ScreenHeader
          meta={<DevScreenHeader screenName="둘러보기" screenNumber="S-10" />}
          title="둘러보기"
        />
        {/*
          화면: 둘러보기 (S-10)
          기능: 카테고리 필터로 취향 기반 추천 장소를 탐색하고 저장한다.
          가능한 다음 이동 화면: S-05
        */}
        <ScreenControls contentContainerStyle={styles.chips} style={styles.controls}>
          {placeCategoryFilterOptions.map((option) => (
            <AppChip
              key={option.value}
              selected={selectedCategory === option.value}
              style={styles.compactChip}
              textStyle={styles.compactChipText}
              onPress={() => setSelectedCategory(option.value)}
            >
              {option.label}
            </AppChip>
          ))}
        </ScreenControls>
        <ScreenBody style={styles.body}>
          {isInitialLoading ? (
            <CardGridSkeleton />
          ) : filteredRecommendations.length === 0 ? (
            <EmptyState
              description="새로운 추천 장소가 준비되면 이곳에 표시됩니다."
              title="지금 인기있는 장소"
            />
          ) : (
            <View style={styles.grid}>
              {filteredRecommendations.map((place) => (
                <View key={place.place_id} style={styles.placeItem}>
                  <PlaceCard
                    category={getPlaceCategoryLabel(place.category)}
                    countryLabel={getPlaceCountryLabel(place.country_code)}
                    fallbackThumbnailUrl={place.source_link?.thumbnail_url}
                    name={place.canonical_name}
                    style={styles.placeCard}
                    thumbnailUrl={place.thumbnail_url}
                    onPress={() => router.push(`/places/${place.place_id}?entry=explore`)}
                  />
                  <Pressable
                    disabled={addCollectionPlaceMutation.isPending}
                    style={styles.saveButton}
                    onPress={() => {
                      void savePlace(place.place_id);
                    }}
                  >
                    <Text style={styles.saveButtonText}>저장</Text>
                  </Pressable>
                </View>
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
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingTop: 0,
    },
    body: { gap: theme.spacing.xs },
    controls: {
      flexBasis: undefined,
      height: 34,
      maxHeight: 34,
      minHeight: 34,
    },
    chips: { flexDirection: 'row', gap: theme.spacing.xs, paddingRight: theme.spacing.sm },
    compactChip: {
      height: 30,
      minWidth: 62,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 0,
    },
    compactChipText: {
      fontSize: 12,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    placeItem: { gap: theme.spacing.xs, width: '48%' },
    placeCard: { width: '100%' },
    saveButton: {
      alignItems: 'center',
      backgroundColor: theme.semantic.primarySoft,
      borderRadius: 8,
      paddingVertical: theme.spacing.xs,
    },
    saveButtonText: { color: theme.semantic.primaryDeep, fontWeight: '800' },
  });
