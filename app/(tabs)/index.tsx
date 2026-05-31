import { Link, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCollectionPlacesQuery, useCollectionsQuery } from '@/src/api/collections/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { CardGridSkeleton } from '@/src/components/LoadingSkeleton';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { AddPlaceCard, PlaceCard } from '@/src/features/places/components/PlaceCard';
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
    <View style={styles.screen}>
      <RefreshableScrollView
        contentContainerStyle={styles.container}
        style={styles.scroll}
        onRefresh={() => Promise.all([collectionsQuery.refetch(), collectionPlacesQuery.refetch()])}
      >
        <DevScreenHeader screenName="홈 / 내 장소" screenNumber="S-02" />
        {/*
          화면: 홈 / 내 장소 (S-02)
          기능: 플레이스 탭별 저장 장소 탐색, 장소 상세 진입, 미처리 장소 후보 진입점을 제공한다.
          가능한 다음 이동 화면: S-04, S-05
        */}
        <View style={styles.header}>
          <Text style={styles.title}>내 장소</Text>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.chips}
          showsHorizontalScrollIndicator={false}
        >
          {placeTabs.map((label) => (
            <TouchableOpacity key={label} onPress={() => setSelectedTab(label)}>
              <Text style={[styles.chip, selectedTab === label && styles.activeChip]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            <Link href={'/(share)/receive' as Href} asChild>
              <AddPlaceCard />
            </Link>
          </View>
        )}
      </RefreshableScrollView>

      {pendingCandidateCount > 0 ? (
        <Link href={'/places/recent' as Href} asChild>
          <TouchableOpacity style={styles.pendingBanner}>
            <Text style={styles.pendingBannerText}>
              새 장소 후보가 {pendingCandidateCount}개 있어요
            </Text>
            <Text style={styles.pendingBannerAction}>→</Text>
          </TouchableOpacity>
        </Link>
      ) : null}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: { backgroundColor: theme.semantic.background, flex: 1 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    container: {
      backgroundColor: theme.semantic.background,
      gap: 20,
      padding: 20,
      paddingBottom: 112,
      paddingTop: 20,
    },
    header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
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
    activeChip: {
      backgroundColor: theme.semantic.primarySoft,
      color: theme.semantic.primaryDeep,
      fontWeight: '700',
    },
    pendingBanner: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.primarySoft,
      borderLeftColor: theme.semantic.primary,
      borderLeftWidth: 4,
      borderWidth: 1,
      borderRadius: 8,
      bottom: 16,
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
      left: 20,
      paddingHorizontal: 16,
      paddingVertical: 14,
      position: 'absolute',
      right: 20,
      shadowColor: '#000000',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    pendingBannerText: { color: theme.semantic.text, flex: 1, fontWeight: '800' },
    pendingBannerAction: { color: theme.semantic.primary, fontSize: 22, fontWeight: '900' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    cardMeta: { color: theme.semantic.textMuted, fontSize: 13 },
  });
