import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useCollectionPlacesQuery, useCollectionsQuery } from '@/src/api/collections/hooks';
import { addItineraryItem } from '@/src/api/itineraries';
import { itineraryKeys, useCreateItineraryMutation } from '@/src/api/itineraries/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { queryClient } from '@/src/lib/queryClient';
import { useAppTheme, type AppTheme } from '@/src/theme';

type SavedPlace = {
  id: string;
  name: string;
  category: string;
  country: string;
};

const quickDestinations = ['일본', '한국', '태국', '베트남', '기타'];

function toDateInput(date: Date | null) {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date | null) {
  return date ? toDateInput(date) : '선택';
}

export default function NewPlanScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const pageWidth = width - 40;
  const slideX = useRef(new Animated.Value(0)).current;
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDateValue, setStartDateValue] = useState<Date | null>(null);
  const [endDateValue, setEndDateValue] = useState<Date | null>(null);
  const [activeDatePicker, setActiveDatePicker] = useState<'end' | 'start' | null>(null);
  const [partySize, setPartySize] = useState(1);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const collectionsQuery = useCollectionsQuery();
  const defaultCollectionId =
    collectionsQuery.data?.items.find((collection) => collection.is_default)?.collection_id ??
    collectionsQuery.data?.items[0]?.collection_id ??
    '';
  const collectionPlacesQuery = useCollectionPlacesQuery(defaultCollectionId);
  const createItineraryMutation = useCreateItineraryMutation();
  const savedPlaces: SavedPlace[] = useMemo(
    () =>
      (collectionPlacesQuery.data?.places ?? []).map((place) => ({
        category: place.category,
        country: place.country_code,
        id: place.place_id,
        name: place.canonical_name,
      })),
    [collectionPlacesQuery.data?.places],
  );
  const startDate = toDateInput(startDateValue);
  const endDate = toDateInput(endDateValue);
  const canGoNext =
    title.trim().length > 0 && destination.trim().length > 0 && !!startDateValue && !!endDateValue;
  const allSelected = savedPlaces.length > 0 && selectedPlaceIds.length === savedPlaces.length;
  const selectedCount = selectedPlaceIds.length;
  const isSubmitting = createItineraryMutation.isPending;

  const goToPlaceStep = () => {
    if (!canGoNext) {
      return;
    }

    Animated.timing(slideX, {
      duration: 260,
      toValue: -pageWidth,
      useNativeDriver: true,
    }).start();
  };

  const goToInfoStep = () => {
    Animated.timing(slideX, {
      duration: 220,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const togglePlace = (placeId: string) => {
    setSelectedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
  };

  const toggleAll = () => {
    setSelectedPlaceIds(allSelected ? [] : savedPlaces.map((place) => place.id));
  };

  const createPlan = async () => {
    if (!canGoNext || isSubmitting) {
      return;
    }

    try {
      const itinerary = await createItineraryMutation.mutateAsync({
        destination_region: destination.trim(),
        end_date: endDate,
        party_size: partySize,
        start_date: startDate,
        title: title.trim(),
      });

      await Promise.all(
        selectedPlaceIds.map((placeId, index) =>
          addItineraryItem(itinerary.itinerary_id, {
            place_id: placeId,
            sort_order: index + 1,
          }),
        ),
      );
      await queryClient.invalidateQueries({ queryKey: itineraryKeys.lists });
      router.replace(`/plans/${itinerary.itinerary_id}`);
    } catch {
      Alert.alert('플랜 생성 실패', '플랜을 만들지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => Promise.all([collectionsQuery.refetch(), collectionPlacesQuery.refetch()])}
    >
      <DevScreenHeader screenName="새 플랜 만들기" screenNumber="S-06N" />
      {/*
        화면: 새 플랜 만들기 (S-06N)
        기능: 플랜 이름, 여행 국가, 날짜, 인원을 입력하고 저장 장소를 선택해 플랜 생성 API를 호출한다.
        가능한 다음 이동 화면: S-07
      */}
      <Text style={styles.screenTitle}>플랜 만들기</Text>
      <View style={[styles.sliderViewport, { width: pageWidth }]}>
        <Animated.View
          style={[
            styles.sliderTrack,
            {
              transform: [{ translateX: slideX }],
              width: pageWidth * 2,
            },
          ]}
        >
          <View style={[styles.page, { width: pageWidth }]}>
            <View style={styles.field}>
              <Text style={styles.label}>플랜 이름</Text>
              <TextInput
                maxLength={50}
                onChangeText={setTitle}
                placeholder="도쿄 여름 여행"
                style={styles.input}
                value={title}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>여행 국가</Text>
              <View style={styles.chips}>
                {quickDestinations.map((item) => (
                  <TouchableOpacity key={item} onPress={() => setDestination(item)}>
                    <Text style={[styles.chip, destination === item && styles.activeChip]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                onChangeText={setDestination}
                placeholder="직접 입력"
                style={styles.input}
                value={destination}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>날짜</Text>
              <View style={styles.dateRow}>
                <TouchableOpacity
                  activeOpacity={0.84}
                  onPress={() => setActiveDatePicker('start')}
                  style={styles.dateSelect}
                >
                  <Text style={styles.dateLabel}>출발일</Text>
                  <Text style={styles.dateValue}>{formatDateLabel(startDateValue)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.84}
                  onPress={() => setActiveDatePicker('end')}
                  style={styles.dateSelect}
                >
                  <Text style={styles.dateLabel}>도착일</Text>
                  <Text style={styles.dateValue}>{formatDateLabel(endDateValue)}</Text>
                </TouchableOpacity>
              </View>
              {activeDatePicker ? (
                <DateTimePicker
                  display="inline"
                  minimumDate={
                    activeDatePicker === 'end' && startDateValue ? startDateValue : undefined
                  }
                  mode="date"
                  onChange={(_event, selectedDate) => {
                    if (!selectedDate) {
                      setActiveDatePicker(null);
                      return;
                    }

                    if (activeDatePicker === 'start') {
                      setStartDateValue(selectedDate);

                      if (endDateValue && selectedDate > endDateValue) {
                        setEndDateValue(selectedDate);
                      }
                    } else {
                      setEndDateValue(selectedDate);
                    }

                    setActiveDatePicker(null);
                  }}
                  value={
                    activeDatePicker === 'start'
                      ? (startDateValue ?? new Date())
                      : (endDateValue ?? startDateValue ?? new Date())
                  }
                />
              ) : null}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>인원</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  disabled={partySize <= 1}
                  onPress={() => setPartySize((value) => value - 1)}
                >
                  <Text style={[styles.counterButton, partySize <= 1 && styles.disabledText]}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{partySize}명</Text>
                <TouchableOpacity
                  disabled={partySize >= 20}
                  onPress={() => setPartySize((value) => value + 1)}
                >
                  <Text style={[styles.counterButton, partySize >= 20 && styles.disabledText]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              disabled={!canGoNext}
              onPress={goToPlaceStep}
              style={[styles.primaryButton, !canGoNext && styles.disabledButton]}
            >
              <Text style={styles.primaryButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.page, { width: pageWidth }]}>
            <View style={styles.stepHeader}>
              <TouchableOpacity onPress={goToInfoStep}>
                <Text style={styles.backText}>이전</Text>
              </TouchableOpacity>
            </View>
            {savedPlaces.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardMeta}>
                  아직 저장한 장소가 없어요. 건너뛰고 나중에 추가할 수 있어요.
                </Text>
              </View>
            ) : (
              <>
                <TouchableOpacity onPress={toggleAll} style={styles.selectAll}>
                  <Text style={styles.cardTitle}>{allSelected ? '전체 해제' : '전체 선택'}</Text>
                </TouchableOpacity>
                {savedPlaces.map((place) => {
                  const selected = selectedPlaceIds.includes(place.id);

                  return (
                    <TouchableOpacity
                      key={place.id}
                      onPress={() => togglePlace(place.id)}
                      style={styles.placeCard}
                    >
                      <View style={styles.thumbnail} />
                      <View style={styles.placeCopy}>
                        <Text style={styles.cardTitle}>{place.name}</Text>
                        <Text style={styles.cardMeta}>
                          {place.category} · {place.country}
                        </Text>
                      </View>
                      <Text style={[styles.checkbox, selected && styles.checked]}>
                        {selected ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={() => {
                void createPlan();
              }}
              style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? '생성 중' : `플랜 만들기 · ${selectedCount}개 선택됨`}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    activeChip: {
      backgroundColor: theme.semantic.primarySoft,
      color: theme.semantic.primaryDeep,
      fontWeight: '800',
    },
    backText: { color: theme.semantic.primary, fontWeight: '800' },
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 12, padding: 14 },
    cardMeta: { color: theme.semantic.textMuted },
    cardTitle: { color: theme.semantic.text, fontWeight: '800' },
    checkbox: {
      borderColor: theme.semantic.borderStrong,
      borderRadius: 6,
      borderWidth: 1,
      color: theme.semantic.onPrimary,
      height: 24,
      lineHeight: 22,
      overflow: 'hidden',
      textAlign: 'center',
      width: 24,
    },
    checked: { backgroundColor: theme.semantic.primary, borderColor: theme.semantic.primary },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20 },
    counter: { alignItems: 'center', flexDirection: 'row', gap: 18 },
    counterButton: { color: theme.semantic.primary, fontSize: 26, fontWeight: '900' },
    counterValue: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    dateLabel: { color: theme.semantic.textSecondary, fontSize: 12, fontWeight: '800' },
    dateRow: { flexDirection: 'row', gap: 8 },
    dateSelect: {
      backgroundColor: theme.semantic.input,
      borderRadius: 8,
      flex: 1,
      gap: 6,
      padding: 12,
    },
    dateValue: { color: theme.semantic.text, fontSize: 16, fontWeight: '800' },
    disabledButton: { opacity: 0.45 },
    disabledText: { color: theme.semantic.disabled },
    field: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 10, padding: 14 },
    input: {
      backgroundColor: theme.semantic.input,
      borderRadius: 8,
      color: theme.semantic.text,
      padding: 12,
    },
    label: { color: theme.semantic.text, fontWeight: '800' },
    page: { gap: 14 },
    placeCard: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 12,
      padding: 12,
    },
    placeCopy: { flex: 1, gap: 6 },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 16 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    screenTitle: { color: theme.semantic.text, fontSize: 34, fontWeight: '900' },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    selectAll: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 14 },
    sliderTrack: { flexDirection: 'row' },
    sliderViewport: { overflow: 'hidden' },
    stepHeader: { gap: 8 },
    thumbnail: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 6,
      height: 58,
      width: 58,
    },
  });
