import { Link, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAppTheme, type AppTheme } from '@/src/theme';

type Place = {
  id: string;
  name: string;
  category: string;
  country: string;
  region: '일본' | '한국' | '동남아';
};

const places: Place[] = [
  { id: 'tokyo-cafe', name: '도쿄 감성 카페', category: '카페', country: '일본', region: '일본' },
  { id: 'seoul-bistro', name: '성수 비스트로', category: '맛집', country: '한국', region: '한국' },
  {
    id: 'bangkok-night',
    name: '방콕 야시장',
    category: '관광명소',
    country: '태국',
    region: '동남아',
  },
];

const placeTabs = ['전체', '일본', '한국', '동남아'] as const;

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [selectedTab, setSelectedTab] = useState<(typeof placeTabs)[number]>('전체');
  const [toastVisible, setToastVisible] = useState(true);

  useEffect(() => {
    if (!toastVisible) {
      return;
    }

    const timer = setTimeout(() => setToastVisible(false), 3000);

    return () => clearTimeout(timer);
  }, [toastVisible]);

  const filteredPlaces = useMemo(
    () => places.filter((place) => selectedTab === '전체' || place.region === selectedTab),
    [selectedTab],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="홈 / 내 장소" screenNumber="S-02" />
      {/*
        화면: 홈 / 내 장소 (S-02)
        기능: 플레이스 탭별 저장 장소 탐색, 장소 상세 진입, 최근 추가 장소 토스트 진입점을 제공한다.
        가능한 다음 이동 화면: S-04, S-05
      */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>내 장소</Text>
          <Text style={styles.title}>홈</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chips}>
        {placeTabs.map((label) => (
          <TouchableOpacity key={label} onPress={() => setSelectedTab(label)}>
            <Text style={[styles.chip, selectedTab === label && styles.activeChip]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {toastVisible ? (
        <Link href={'/places/recent' as Href} asChild>
          <TouchableOpacity style={styles.toast}>
            <Text style={styles.toastText}>📍 도쿄 맛집 VLOG에서 장소 3곳이 추가됐어요</Text>
          </TouchableOpacity>
        </Link>
      ) : null}

      <View style={styles.grid}>
        {filteredPlaces.map((place) => (
          <Link key={place.id} href={`/places/${place.id}` as Href} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.thumbnail} />
              <Text style={styles.cardTitle}>{place.name}</Text>
              <Text style={styles.cardMeta}>
                {place.category} · {place.country}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 20, padding: 20, paddingTop: 64 },
    header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    eyebrow: { color: theme.semantic.textMuted, fontSize: 13 },
    title: { color: theme.semantic.text, fontSize: 30, fontWeight: '800' },
    iconButton: {
      alignItems: 'center',
      backgroundColor: theme.semantic.primaryDeep,
      borderRadius: 22,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    iconButtonText: { color: theme.semantic.onPrimary, fontSize: 24, fontWeight: '700' },
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
    toast: { backgroundColor: theme.semantic.primarySoft, borderRadius: 8, padding: 14 },
    toastText: { color: theme.semantic.primaryDeep, fontWeight: '700' },
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
  });
