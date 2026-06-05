import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

import {
  collectionKeys,
  useAddCollectionPlaceMutation,
  useCollectionsQuery,
  useRemoveCollectionPlaceMutation,
} from '@/src/api/collections/hooks';
import { usePlaceQuery } from '@/src/api/places/hooks';
import { useMeQuery } from '@/src/api/users/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { createPlaceDetailViewModel } from '@/src/features/places/viewModel';
import { queryClient } from '@/src/lib/queryClient';
import { usePlaceCandidateStore } from '@/src/stores/placeCandidates';
import { useAppTheme, type AppTheme } from '@/src/theme';

const kakaoJsKey = process.env.EXPO_PUBLIC_KAKAO_JS_KEY;

export default function PlaceDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { candidateId, entry, placeId } = useLocalSearchParams<{
    candidateId?: string;
    entry?: string;
    placeId: string;
  }>();
  const candidates = usePlaceCandidateStore((state) => state.candidates);
  const meQuery = useMeQuery();
  const placeQuery = usePlaceQuery(placeId ?? '');
  const collectionsQuery = useCollectionsQuery();
  const defaultCollectionId =
    collectionsQuery.data?.items.find((collection) => collection.is_default)?.collection_id ??
    collectionsQuery.data?.items[0]?.collection_id ??
    '';
  const addCollectionPlaceMutation = useAddCollectionPlaceMutation(defaultCollectionId);
  const removeCollectionPlaceMutation = useRemoveCollectionPlaceMutation(defaultCollectionId);
  const place = placeQuery.data ? createPlaceDetailViewModel(placeQuery.data) : null;
  const showAddToMyPlaces = entry === 'explore';
  const showDeleteFromMyPlaces = entry === 'my-place';
  const showEvidence = entry === 'candidate';
  const preferredMapProvider = meQuery.data?.map_provider ?? 'kakao';
  const candidateEvidence = candidates.find(
    (candidate) => candidate.candidate_id === candidateId,
  )?.evidence;

  const openExternalMap = async (provider: 'google' | 'kakao') => {
    if (!place) {
      return;
    }

    const encodedName = encodeURIComponent(place.name);
    const googleUrl = place.googlePlaceId
      ? `https://www.google.com/maps/search/?api=1&query=${encodedName}&query_place_id=${encodeURIComponent(
          place.googlePlaceId,
        )}`
      : `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    const kakaoUrl = `https://map.kakao.com/link/search/${encodedName}`;
    const url = provider === 'google' ? googleUrl : kakaoUrl;

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        throw new Error('Unsupported map URL');
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert('지도 열기 실패', '외부 지도를 열지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const addToMyPlaces = async () => {
    if (!place || !defaultCollectionId) {
      return;
    }

    try {
      await addCollectionPlaceMutation.mutateAsync({ place_id: place.id });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: collectionKeys.lists }),
        queryClient.invalidateQueries({ queryKey: collectionKeys.places(defaultCollectionId) }),
      ]);
      Alert.alert('추가 완료', '내 플레이스에 장소를 추가했어요.');
    } catch {
      Alert.alert('추가 실패', '장소를 추가하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const deleteFromMyPlaces = () => {
    if (!place || !defaultCollectionId) {
      return;
    }

    Alert.alert('장소 삭제', `${place.name}을 내 장소에서 삭제할까요?`, [
      { style: 'cancel', text: '취소' },
      {
        onPress: async () => {
          try {
            await removeCollectionPlaceMutation.mutateAsync(place.id);
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: collectionKeys.lists }),
              queryClient.invalidateQueries({
                queryKey: collectionKeys.places(defaultCollectionId),
              }),
            ]);
            router.replace('/');
          } catch {
            Alert.alert('삭제 실패', '장소를 삭제하지 못했어요. 잠시 후 다시 시도해주세요.');
          }
        },
        style: 'destructive',
        text: '삭제',
      },
    ]);
  };

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
        기능: 지도, 정규화된 장소 정보, 외부 지도 연결, 원본 영상 이동을 제공하고 진입 경로에 따라 추출 근거 또는 내 플레이스 추가 액션을 제공한다.
        가능한 다음 이동 화면: S-02
      */}
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.meta}>{place.meta}</Text>
      <PlaceKakaoMap latitude={place.latitude} longitude={place.longitude} name={place.name} />
      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => openExternalMap(preferredMapProvider)}
      >
        <Text style={styles.outlineText}>
          {preferredMapProvider === 'kakao' ? 'Kakao Maps에서 보기' : 'Google Maps에서 보기'}
        </Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>원본 영상</Text>
        <Text style={styles.body}>{place.sourceLabel}</Text>
      </View>
      {showEvidence ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추출 근거</Text>
          <Text style={styles.body}>{candidateEvidence ?? place.evidence}</Text>
        </View>
      ) : null}
      {showAddToMyPlaces ? (
        <TouchableOpacity
          disabled={!defaultCollectionId || addCollectionPlaceMutation.isPending}
          style={[
            styles.addButton,
            (!defaultCollectionId || addCollectionPlaceMutation.isPending) && styles.disabledButton,
          ]}
          onPress={addToMyPlaces}
        >
          <Text style={styles.addButtonText}>
            {addCollectionPlaceMutation.isPending ? '추가 중...' : '내 플레이스에 추가하기'}
          </Text>
        </TouchableOpacity>
      ) : null}
      {showDeleteFromMyPlaces ? (
        <TouchableOpacity
          disabled={!defaultCollectionId || removeCollectionPlaceMutation.isPending}
          style={[
            styles.deleteButton,
            (!defaultCollectionId || removeCollectionPlaceMutation.isPending) &&
              styles.disabledButton,
          ]}
          onPress={deleteFromMyPlaces}
        >
          <Text style={styles.deleteButtonText}>
            {removeCollectionPlaceMutation.isPending ? '삭제 중...' : '내 장소에서 삭제'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </RefreshableScrollView>
  );
}

type PlaceKakaoMapProps = {
  latitude: number;
  longitude: number;
  name: string;
};

function PlaceKakaoMap({ latitude, longitude, name }: PlaceKakaoMapProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (!kakaoJsKey) {
    return (
      <View style={styles.map}>
        <Text style={styles.mapText}>Kakao 지도 설정 필요</Text>
        <Text style={styles.mapMeta}>
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.map}>
      <WebView
        originWhitelist={['*']}
        scrollEnabled={false}
        source={{ html: createKakaoMapHtml({ kakaoJsKey, latitude, longitude, name }) }}
        style={styles.webMap}
      />
    </View>
  );
}

function createKakaoMapHtml({
  kakaoJsKey,
  latitude,
  longitude,
  name,
}: PlaceKakaoMapProps & { kakaoJsKey: string }) {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoJsKey)}&autoload=false"></script>
    <script>
      kakao.maps.load(function () {
        var position = new kakao.maps.LatLng(${latitude}, ${longitude});
        var map = new kakao.maps.Map(document.getElementById('map'), {
          center: position,
          level: 3
        });
        var marker = new kakao.maps.Marker({ position: position });
        marker.setMap(map);
        var infowindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:6px 10px;font-size:13px;font-weight:700;white-space:nowrap;">${escapeHtml(name)}</div>'
        });
        infowindow.open(map, marker);
      });
    </script>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.semantic.background, flexGrow: 1, gap: 16, padding: 20 },
    scroll: { backgroundColor: theme.semantic.background, flex: 1 },
    map: {
      alignItems: 'center',
      backgroundColor: theme.semantic.borderStrong,
      borderRadius: 8,
      height: 132,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    mapText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    mapMeta: { color: theme.semantic.textMuted, marginTop: 8 },
    webMap: { flex: 1, width: '100%' },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    meta: { color: theme.semantic.textMuted },
    row: { flexDirection: 'row', gap: 10 },
    outlineButton: {
      borderColor: theme.semantic.borderStrong,
      borderRadius: 8,
      borderWidth: 1,
      padding: 12,
    },
    outlineText: { color: theme.semantic.text, fontWeight: '700', textAlign: 'center' },
    section: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 8, padding: 14 },
    sectionTitle: { color: theme.semantic.text, fontSize: 16, fontWeight: '800' },
    body: { color: theme.semantic.textSecondary, lineHeight: 20 },
    addButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 14 },
    addButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    deleteButton: { backgroundColor: theme.semantic.danger, borderRadius: 8, padding: 14 },
    deleteButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    disabledButton: { opacity: 0.45 },
  });
