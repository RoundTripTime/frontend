import { Link, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { mockPlaces } from '@/src/mocks/fixtures';
import { useAppTheme, type AppTheme } from '@/src/theme';

type SavedPlace = {
  id: string;
  name: string;
  category: string;
  country: string;
};

const quickDestinations = ['일본', '한국', '태국', '베트남', '기타'];
const savedPlaces: SavedPlace[] = mockPlaces.map((place) => ({
  id: place.place_id,
  name: place.canonical_name,
  category: place.category,
  country: place.country_code,
}));

export default function NewPlanScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);

  const canGoNext =
    title.trim().length > 0 && destination.trim().length > 0 && startDate && endDate;
  const allSelected = savedPlaces.length > 0 && selectedPlaceIds.length === savedPlaces.length;
  const selectedCount = selectedPlaceIds.length;
  const createHref = useMemo(() => '/plans/draft-plan' as Href, []);

  const togglePlace = (placeId: string) => {
    setSelectedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
  };

  const toggleAll = () => {
    setSelectedPlaceIds(allSelected ? [] : savedPlaces.map((place) => place.id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevScreenHeader screenName="새 플랜 만들기" screenNumber="S-06N" />
      {/*
        화면: 새 플랜 만들기 (S-06N)
        기능: 기본 정보 입력과 장소 선택 2단계 플로우로 플랜 생성 후 편집 화면으로 이동한다.
        가능한 다음 이동 화면: S-07
      */}
      <Text style={styles.step}>{step === 1 ? '● ○' : '● ●'}</Text>
      {step === 1 ? (
        <>
          <Text style={styles.title}>기본 정보</Text>
          <View style={styles.field}>
            <Text style={styles.label}>플랜 이름</Text>
            <TextInput
              maxLength={50}
              placeholder="도쿄 여름 여행"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>여행지</Text>
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
              placeholder="직접 입력"
              style={styles.input}
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>날짜 범위</Text>
            <View style={styles.dateRow}>
              <TextInput
                placeholder="출발일"
                style={[styles.input, styles.dateInput]}
                value={startDate}
                onChangeText={setStartDate}
              />
              <TextInput
                placeholder="도착일"
                style={[styles.input, styles.dateInput]}
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>인원</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                disabled={partySize <= 1}
                onPress={() => setPartySize((value) => value - 1)}
              >
                <Text style={[styles.counterButton, partySize <= 1 && styles.disabledText]}>-</Text>
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
            style={[styles.primaryButton, !canGoNext && styles.disabledButton]}
            onPress={() => setStep(2)}
          >
            <Text style={styles.primaryButtonText}>다음</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.stepHeader}>
            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.backText}>이전</Text>
            </TouchableOpacity>
            <Text style={styles.title}>장소 선택</Text>
          </View>
          {savedPlaces.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardMeta}>
                아직 저장한 장소가 없어요. 건너뛰고 나중에 추가할 수 있어요.
              </Text>
              <Link href={createHref} asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>건너뛰기</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.selectAll} onPress={toggleAll}>
                <Text style={styles.cardTitle}>{allSelected ? '전체 해제' : '전체 선택'}</Text>
              </TouchableOpacity>
              {savedPlaces.map((place) => {
                const selected = selectedPlaceIds.includes(place.id);

                return (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.placeCard}
                    onPress={() => togglePlace(place.id)}
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
          <Link href={createHref} asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>플랜 만들기 · {selectedCount}개 선택됨</Text>
            </TouchableOpacity>
          </Link>
        </>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20, paddingTop: 32 },
    step: { color: theme.semantic.primary, fontSize: 18, fontWeight: '900' },
    stepHeader: { gap: 8 },
    title: { color: theme.semantic.text, fontSize: 24, fontWeight: '800' },
    field: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 10, padding: 14 },
    label: { color: theme.semantic.text, fontWeight: '800' },
    input: {
      backgroundColor: theme.semantic.input,
      borderRadius: 8,
      color: theme.semantic.text,
      padding: 12,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 18,
      color: theme.semantic.textSecondary,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    activeChip: {
      backgroundColor: theme.semantic.primarySoft,
      color: theme.semantic.primaryDeep,
      fontWeight: '800',
    },
    dateRow: { flexDirection: 'row', gap: 8 },
    dateInput: { flex: 1 },
    counter: { alignItems: 'center', flexDirection: 'row', gap: 18 },
    counterButton: { color: theme.semantic.primary, fontSize: 26, fontWeight: '900' },
    counterValue: { color: theme.semantic.text, fontSize: 18, fontWeight: '800' },
    disabledText: { color: theme.semantic.disabled },
    backText: { color: theme.semantic.primary, fontWeight: '800' },
    card: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 12, padding: 14 },
    cardTitle: { color: theme.semantic.text, fontWeight: '800' },
    cardMeta: { color: theme.semantic.textMuted },
    selectAll: { backgroundColor: theme.semantic.surface, borderRadius: 8, padding: 14 },
    placeCard: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 12,
      padding: 12,
    },
    thumbnail: {
      backgroundColor: theme.semantic.mediaPlaceholder,
      borderRadius: 6,
      height: 58,
      width: 58,
    },
    placeCopy: { flex: 1, gap: 6 },
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
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 16 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    secondaryButton: { backgroundColor: theme.semantic.surfaceMuted, borderRadius: 8, padding: 15 },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '800', textAlign: 'center' },
    disabledButton: { opacity: 0.45 },
  });
