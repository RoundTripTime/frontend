import { Link, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCollectionPlacesQuery, useCollectionsQuery } from '@/src/api/collections/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import {
  ScreenBody,
  ScreenControls,
  ScreenHeader,
  ScreenOverlay,
  ScreenRoot,
  ScreenScroll,
} from '@/src/components/layout';
import { CardGridSkeleton } from '@/src/components/LoadingSkeleton';
import { AppChip } from '@/src/components/ui';
import { useRefreshLatestExtractionResult } from '@/src/features/extraction/useRefreshLatestExtractionResult';
import { PlaceCard } from '@/src/features/places/components/PlaceCard';
import { createPlaceCardViewModel, type PlaceRegionFilter } from '@/src/features/places/viewModel';
import { useMinimumLoading } from '@/src/hooks/useMinimumLoading';
import {
  selectPendingPlaceCandidateCount,
  usePlaceCandidateStore,
} from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

const placeTabs = ['전체', '일본', '한국', '동남아'] as const satisfies PlaceRegionFilter[];

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [selectedTab, setSelectedTab] = useState<(typeof placeTabs)[number]>('전체');
  const refreshLatestExtractionResult = useRefreshLatestExtractionResult();
  const pendingCandidateCount = usePlaceCandidateStore(selectPendingPlaceCandidateCount);
  const collectionsQuery = useCollectionsQuery();
  const defaultCollectionId =
    collectionsQuery.data?.items.find((collection) => collection.is_default)?.collection_id ??
    collectionsQuery.data?.items[0]?.collection_id ??
    '';
  const collectionPlacesQuery = useCollectionPlacesQuery(defaultCollectionId);
  const isInitialQueryLoading =
    (collectionsQuery.isPending && !collectionsQuery.data) ||
    (collectionPlacesQuery.isPending && !collectionPlacesQuery.data);
  const isInitialLoading = useMinimumLoading(isInitialQueryLoading);
  const placeCards = useMemo(
    () => (collectionPlacesQuery.data?.places ?? []).map(createPlaceCardViewModel),
    [collectionPlacesQuery.data?.places],
  );

  const filteredPlaces = useMemo(
    () => placeCards.filter((place) => selectedTab === '전체' || place.region === selectedTab),
    [placeCards, selectedTab],
  );

  return (
    <ScreenRoot>
      <ScreenScroll
        applyBottomInset
        contentContainerStyle={styles.container}
        insetSpacing={theme.spacing.xxl * 3}
        onRefresh={() =>
          Promise.all([
            collectionsQuery.refetch(),
            collectionPlacesQuery.refetch(),
            refreshLatestExtractionResult(),
          ])
        }
      >
        <ScreenHeader
          action={
            <Link href={'/(share)/receive' as Href} asChild>
              <TouchableOpacity activeOpacity={0.84} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ 추가</Text>
              </TouchableOpacity>
            </Link>
          }
          meta={<DevScreenHeader screenName="홈 / 내 장소" screenNumber="S-02" />}
          title="내 장소"
        />
        {/*
          화면: 홈 / 내 장소 (S-02)
          기능: 플레이스 탭별 저장 장소 탐색, 장소 상세 진입, 미처리 장소 후보 진입점을 제공한다.
          가능한 다음 이동 화면: S-04, S-05
        */}

        <ScreenControls contentContainerStyle={styles.chips}>
          {placeTabs.map((label) => (
            <AppChip
              key={label}
              selected={selectedTab === label}
              onPress={() => setSelectedTab(label)}
            >
              {label}
            </AppChip>
          ))}
        </ScreenControls>

        <ScreenBody style={styles.body}>
          {isInitialLoading ? (
            <CardGridSkeleton />
          ) : (
            <View style={styles.grid}>
              {filteredPlaces.map((place) => (
                <Link key={place.id} href={`/places/${place.id}?entry=my-place` as Href} asChild>
                  <PlaceCard
                    category={place.category}
                    countryLabel={place.countryLabel}
                    name={place.name}
                  />
                </Link>
              ))}
            </View>
          )}
        </ScreenBody>
      </ScreenScroll>

      {pendingCandidateCount > 0 ? (
        <ScreenOverlay applyBottomInset style={styles.pendingOverlay}>
          <Link href={'/places/recent' as Href} asChild>
            <TouchableOpacity style={styles.pendingBanner}>
              <Text style={styles.pendingBannerText}>
                새 장소 후보가 {pendingCandidateCount}개 있어요
              </Text>
              <Text style={styles.pendingBannerAction}>→</Text>
            </TouchableOpacity>
          </Link>
        </ScreenOverlay>
      ) : null}
    </ScreenRoot>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl * 3,
      paddingTop: theme.spacing.md,
    },
    addButton: {
      backgroundColor: theme.semantic.primary,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    addButtonText: {
      color: theme.semantic.onPrimary,
      fontSize: theme.typography.size.label,
      fontWeight: '900',
    },
    chips: { flexDirection: 'row', gap: theme.spacing.sm, paddingRight: theme.spacing.lg },
    body: { gap: theme.spacing.lg },
    pendingOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: theme.spacing.lg,
    },
    pendingBanner: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.primarySoft,
      borderLeftColor: theme.semantic.primary,
      borderLeftWidth: 4,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      shadowColor: '#000000',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    pendingBannerText: { color: theme.semantic.text, flex: 1, fontWeight: '800' },
    pendingBannerAction: {
      color: theme.semantic.primary,
      fontSize: theme.typography.size.title,
      fontWeight: '900',
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  });
