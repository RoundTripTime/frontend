import { Link, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { createPlaceCardViewModel, type PlaceRegionFilter } from '@/src/features/places/viewModel';
import { mockPlaces } from '@/src/mocks/fixtures';
import {
  selectPendingPlaceCandidateCount,
  usePlaceCandidateStore,
} from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

const placeTabs = ['전체', '일본', '한국', '동남아'] as const satisfies PlaceRegionFilter[];
const placeCards = mockPlaces.map(createPlaceCardViewModel);

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [selectedTab, setSelectedTab] = useState<(typeof placeTabs)[number]>('전체');
  const pendingCandidateCount = usePlaceCandidateStore(selectPendingPlaceCandidateCount);

  const filteredPlaces = useMemo(
    () => placeCards.filter((place) => selectedTab === '전체' || place.region === selectedTab),
    [selectedTab],
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <DevScreenHeader screenName="홈 / 내 장소" screenNumber="S-02" />
        {/*
          화면: 홈 / 내 장소 (S-02)
          기능: 플레이스 탭별 저장 장소 탐색, 장소 상세 진입, 미처리 장소 후보 진입점을 제공한다.
          가능한 다음 이동 화면: S-04, S-05
        */}
        <View style={styles.header}>
          <Text style={styles.title}>내 장소</Text>
        </View>

        <View style={styles.chips}>
          {placeTabs.map((label) => (
            <TouchableOpacity key={label} onPress={() => setSelectedTab(label)}>
              <Text style={[styles.chip, selectedTab === label && styles.activeChip]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.grid}>
          {filteredPlaces.map((place) => (
            <Link key={place.id} href={`/places/${place.id}` as Href} asChild>
              <TouchableOpacity style={styles.card}>
                <View style={styles.thumbnail} />
                <Text style={styles.cardTitle}>{place.name}</Text>
                <Text style={styles.cardMeta}>
                  {place.category} · {place.countryLabel}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
          <TouchableOpacity style={styles.addCard}>
            <View style={styles.addPreview}>
              <Text style={styles.addIcon}>+</Text>
            </View>
            <Text style={styles.addText}>플레이스 추가</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {pendingCandidateCount > 0 ? (
        <Link href={'/places/recent' as Href} asChild>
          <TouchableOpacity style={styles.pendingBanner}>
            <Text style={styles.pendingBannerText}>
              수락/삭제하지 않은 새 장소 후보가 {pendingCandidateCount}개 있어요
            </Text>
            <Text style={styles.pendingBannerAction}>확인</Text>
          </TouchableOpacity>
        </Link>
      ) : null}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: { backgroundColor: theme.semantic.background, flex: 1 },
    container: {
      backgroundColor: theme.semantic.background,
      gap: 20,
      padding: 20,
      paddingBottom: 112,
      paddingTop: 64,
    },
    header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    title: { color: theme.semantic.text, fontSize: 30, fontWeight: '800' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
      backgroundColor: theme.semantic.primary,
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
    },
    pendingBannerText: { color: theme.semantic.onPrimary, flex: 1, fontWeight: '800' },
    pendingBannerAction: { color: theme.semantic.onPrimary, fontWeight: '900' },
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
    addCard: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      gap: 8,
      padding: 12,
      width: '48%',
    },
    addPreview: {
      alignItems: 'center',
      backgroundColor: theme.semantic.input,
      aspectRatio: 16 / 9,
      borderColor: theme.semantic.borderStrong,
      borderRadius: 6,
      borderStyle: 'dashed',
      borderWidth: 1,
      justifyContent: 'center',
      width: '100%',
    },
    addIcon: {
      color: theme.semantic.primary,
      fontSize: 28,
      fontWeight: '900',
      lineHeight: 30,
    },
    addText: { color: theme.semantic.textSecondary, fontWeight: '800' },
  });
