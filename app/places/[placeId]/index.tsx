import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { usePlaceQuery } from '@/src/api/places/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { createPlaceDetailViewModel } from '@/src/features/places/viewModel';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function PlaceDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const placeQuery = usePlaceQuery(placeId ?? '');
  const place = placeQuery.data ? createPlaceDetailViewModel(placeQuery.data) : null;

  if (placeQuery.isLoading) {
    return (
      <RefreshableScrollView
        contentContainerStyle={styles.container}
        style={styles.scroll}
        onRefresh={() => placeQuery.refetch()}
      >
        <DevScreenHeader screenName="장소 상세" screenNumber="S-05" />
        <Text style={styles.body}>장소 정보를 불러오는 중입니다.</Text>
      </RefreshableScrollView>
    );
  }

  if (!place) {
    return (
      <RefreshableScrollView
        contentContainerStyle={styles.container}
        style={styles.scroll}
        onRefresh={() => placeQuery.refetch()}
      >
        <DevScreenHeader screenName="장소 상세" screenNumber="S-05" />
        <Text style={styles.body}>장소 정보를 불러오지 못했습니다.</Text>
      </RefreshableScrollView>
    );
  }

  return (
    <RefreshableScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      onRefresh={() => placeQuery.refetch()}
    >
      <DevScreenHeader screenName="장소 상세" screenNumber="S-05" />
      {/*
        화면: 장소 상세 (S-05)
        기능: 지도, 정규화된 장소 정보, 외부 지도 연결, 원본 영상 이동, 추출 근거와 수락/거절 액션을 제공한다.
        가능한 다음 이동 화면: S-02
      */}
      <View style={styles.map}>
        <Text style={styles.mapText}>지도</Text>
        <Text style={styles.mapMeta}>
          {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
        </Text>
      </View>
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.meta}>{place.meta}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineText}>Kakao Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineText}>Google Maps</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>원본 영상</Text>
        <Text style={styles.body}>{place.sourceLabel}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추출 근거</Text>
        <Text style={styles.body}>{place.evidence}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.accept}>
          <Text style={styles.acceptText}>수락</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reject}>
          <Text style={styles.rejectText}>거절</Text>
        </TouchableOpacity>
      </View>
    </RefreshableScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, flexGrow: 1, gap: 16, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    map: {
      alignItems: 'center',
      backgroundColor: theme.semantic.borderStrong,
      borderRadius: 8,
      height: 220,
      justifyContent: 'center',
    },
    mapText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    mapMeta: { color: theme.semantic.textMuted, marginTop: 8 },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    row: { flexDirection: 'row', gap: 10 },
    outlineButton: {
      borderColor: theme.semantic.borderStrong,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      padding: 12,
    },
    outlineText: { color: theme.semantic.text, fontWeight: '700', textAlign: 'center' },
    section: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    sectionTitle: { color: theme.semantic.text, fontSize: 16, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 20 },
    accept: { backgroundColor: theme.semantic.success, borderRadius: 8, flex: 1, padding: 14 },
    acceptText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    reject: { backgroundColor: theme.semantic.surfaceMuted, borderRadius: 8, flex: 1, padding: 14 },
    rejectText: { color: theme.semantic.danger, fontWeight: '800', textAlign: 'center' },
  });
