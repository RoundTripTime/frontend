import { Ionicons } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Link, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useItineraryQuery } from '@/src/api/itineraries/hooks';
import { getPlace } from '@/src/api/places';
import { placeKeys } from '@/src/api/places/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { MapOverlaySheet } from '@/src/components/MapOverlaySheet';
import { KakaoWebViewMap } from '@/src/components/maps/KakaoWebViewMap';
import { createPlanMapViewModel } from '@/src/features/plans/viewModel';
import { useAppTheme, type AppTheme } from '@/src/theme';

import type { PlaceDetail } from '@/src/api/places/types';
import type { KakaoMapMarker } from '@/src/components/maps/KakaoWebViewMap';

export default function PlanMapScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const safeAreaInsets = useSafeAreaInsets();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const currentPlanId = planId ?? '';
  const planQuery = useItineraryQuery(currentPlanId);
  const planMap = planQuery.data ? createPlanMapViewModel(planQuery.data) : null;
  const scheduledDays = useMemo(
    () => planMap?.days.filter((day) => day.items.length > 0) ?? [],
    [planMap?.days],
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const selectedDay = scheduledDays.find((day) => day.dayIndex === selectedDayIndex) ?? null;
  const selectedItems = selectedDay?.items ?? [];
  const placeIds = useMemo(
    () => [...new Set((planMap?.allItems ?? []).map((item) => item.placeId))],
    [planMap?.allItems],
  );
  const placeQueries = useQueries({
    queries: placeIds.map((placeId) => ({
      enabled: !!placeId,
      queryFn: () => getPlace(placeId),
      queryKey: placeKeys.detail(placeId),
    })),
  });
  const placeCoordinates = useMemo(() => {
    const entries: [string, { latitude: number; longitude: number }][] = placeQueries
      .map((query) => query.data)
      .filter((place): place is PlaceDetail => !!place)
      .map((place) => [
        place.place_id,
        {
          latitude: place.latitude,
          longitude: place.longitude,
        },
      ]);

    return new Map(entries);
  }, [placeQueries]);
  const mapMarkers: KakaoMapMarker[] = selectedItems.reduce<KakaoMapMarker[]>(
    (markers, item, index) => {
      const fallbackCoordinates = placeCoordinates.get(item.placeId);
      const latitude = Number.isFinite(item.latitude)
        ? item.latitude
        : fallbackCoordinates?.latitude;
      const longitude = Number.isFinite(item.longitude)
        ? item.longitude
        : fallbackCoordinates?.longitude;

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return markers;
      }

      markers.push({
        id: item.itemId,
        latitude: latitude as number,
        longitude: longitude as number,
        order: index + 1,
        title: item.name,
      });

      return markers;
    },
    [],
  );

  useEffect(() => {
    if (scheduledDays.length === 0) {
      setSelectedDayIndex(null);
      return;
    }

    if (!scheduledDays.some((day) => day.dayIndex === selectedDayIndex)) {
      setSelectedDayIndex(scheduledDays[0]!.dayIndex);
    }
  }, [scheduledDays, selectedDayIndex]);

  return (
    <View style={styles.screen}>
      <DevScreenHeader screenName="플랜 지도 스플릿 뷰" screenNumber="S-07-M" />
      {/*
        화면: 플랜 지도 스플릿 뷰 (S-07-M)
        기능: 플랜 장소 마커를 전체화면 지도에 표시하고 하단 시트에서 Day별 일정을 함께 확인한다.
        가능한 다음 이동 화면: S-05, S-07
      */}
      <KakaoWebViewMap markers={mapMarkers} style={styles.map} />
      <TouchableOpacity
        accessibilityLabel="뒤로가기"
        activeOpacity={0.75}
        style={[styles.backButton, { top: safeAreaInsets.top + 10 }]}
        onPress={() => router.back()}
      >
        <Ionicons color={theme.semantic.text} name="chevron-back" size={24} />
      </TouchableOpacity>
      <MapOverlaySheet collapsedHeight={92} style={styles.sheet}>
        <Text style={styles.sheetTitle}>Day별 장소</Text>
        <ScrollView
          horizontal
          style={styles.dayTabsScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayTabs}
        >
          {scheduledDays.map((day) => {
            const selected = day.dayIndex === selectedDayIndex;

            return (
              <TouchableOpacity
                key={day.dayIndex}
                style={[styles.dayTab, selected && styles.selectedDayTab]}
                onPress={() => setSelectedDayIndex(day.dayIndex)}
              >
                <Text style={[styles.dayTabText, selected && styles.selectedDayTabText]}>
                  {day.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <Link key={item.itemId} href={`/places/${item.placeId}` as Href} asChild>
              <TouchableOpacity style={styles.placeRow}>
                <Text style={styles.placeOrder}>{index + 1}</Text>
                <Text style={styles.placeName}>{item.name}</Text>
              </TouchableOpacity>
            </Link>
          ))
        ) : (
          <Text style={styles.emptyText}>배치된 장소가 없습니다.</Text>
        )}
      </MapOverlaySheet>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: { backgroundColor: theme.semantic.background, flex: 1 },
    dayTabs: { alignItems: 'center', gap: 8, paddingRight: 8 },
    dayTabsScroll: { flexGrow: 0, height: 34, maxHeight: 34 },
    dayTab: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderColor: theme.semantic.border,
      borderRadius: 15,
      borderWidth: 1,
      height: 30,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    dayTabText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    emptyText: { color: theme.semantic.textMuted, fontWeight: '700' },
    map: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.semantic.borderStrong,
    },
    backButton: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 20,
      borderWidth: 1,
      height: 40,
      justifyContent: 'center',
      left: 16,
      position: 'absolute',
      width: 40,
      zIndex: 20,
    },
    sheet: {
      backgroundColor: theme.semantic.surface,
      gap: 8,
      paddingHorizontal: 18,
      paddingTop: 10,
    },
    placeName: { color: theme.semantic.text, flex: 1, fontWeight: '800' },
    placeOrder: {
      backgroundColor: theme.semantic.primary,
      borderRadius: 12,
      color: theme.semantic.onPrimary,
      fontSize: 12,
      fontWeight: '900',
      height: 24,
      lineHeight: 24,
      overflow: 'hidden',
      textAlign: 'center',
      width: 24,
    },
    placeRow: {
      alignItems: 'center',
      backgroundColor: theme.semantic.primarySoft,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 10,
      padding: 10,
    },
    selectedDayTab: {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
    },
    selectedDayTabText: { color: theme.semantic.onPrimary },
    sheetTitle: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
  });
