import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useAppTheme } from '@/src/theme';

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY;
const KAKAO_MAP_BASE_URL = 'https://roundtrip.duckdns.org';

export type KakaoMapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  order?: number;
  title?: string;
};

type KakaoWebViewMapProps = {
  markers: KakaoMapMarker[];
  showPolyline?: boolean;
  style?: ViewStyle;
};

type MapMessage =
  | {
      type: 'ready';
    }
  | {
      message?: string;
      type: 'error';
    };

function createMapHtml(appKey: string, initialMarkers: unknown[], initialShowPolyline: boolean) {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <style>
      html,
      body,
      #map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }

      body {
        background: #f2f4f6;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const appKey = ${JSON.stringify(appKey)};
      const initialMarkers = parseMarkers(${JSON.stringify(initialMarkers)});
      const initialShowPolyline = ${JSON.stringify(initialShowPolyline)};
      let map = null;
      let markers = [];
      let markerLabels = [];
      let polyline = null;

      function postMessage(payload) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      function fail(message) {
        postMessage({ type: 'error', message });
      }

      function escapeHtml(value) {
        return String(value || '')
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#039;');
      }

      function parseMarkers(value) {
        if (!Array.isArray(value)) {
          return [];
        }

        return value
          .map(function (marker, index) {
            return {
              id: String(marker.id || index),
              lat: Number(marker.lat),
              lng: Number(marker.lng),
              order: marker.order,
              title: marker.title || '',
            };
          })
          .filter(function (marker) {
            return Number.isFinite(marker.lat) && Number.isFinite(marker.lng);
          });
      }

      function clearMapObjects() {
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];
        markerLabels.forEach(function (label) {
          label.setMap(null);
        });
        markerLabels = [];

        if (polyline) {
          polyline.setMap(null);
          polyline = null;
        }
      }

      function renderMarkers(nextMarkers, showPolyline) {
        if (!map || !window.kakao || !window.kakao.maps) {
          return;
        }

        clearMapObjects();

        if (nextMarkers.length === 0) {
          return;
        }

        const bounds = new window.kakao.maps.LatLngBounds();
        const path = nextMarkers.map(function (marker) {
          const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
          const markerTitle = escapeHtml(marker.title);
          bounds.extend(position);

          markers.push(
            new window.kakao.maps.Marker({
              map,
              position,
              title: marker.title,
            }),
          );

          markerLabels.push(
            new window.kakao.maps.CustomOverlay({
              content:
                '<div style="display:flex;align-items:center;gap:6px;max-width:180px;padding:5px 8px 5px 5px;border-radius:999px;background:#fff;color:#191f28;font-size:12px;font-weight:800;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,0.22);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
                '<span style="flex:0 0 auto;width:24px;height:24px;border-radius:12px;background:#2563eb;color:#fff;font-size:12px;font-weight:900;line-height:24px;text-align:center;">' +
                (marker.order || '') +
                '</span>' +
                '<span style="overflow:hidden;text-overflow:ellipsis;">' +
                markerTitle +
                '</span>' +
                '</div>',
              map,
              position,
              yAnchor: 2.15,
            }),
          );

          return position;
        });

        if (showPolyline && path.length > 1) {
          polyline = new window.kakao.maps.Polyline({
            map,
            path,
            strokeColor: '#2563eb',
            strokeOpacity: 0.85,
            strokeStyle: 'solid',
            strokeWeight: 4,
          });
        }

        window.setTimeout(function () {
          map.relayout();
          if (nextMarkers.length === 1) {
            map.setLevel(4);
            map.setCenter(path[0]);
          } else {
            map.setBounds(bounds);
          }
        }, 100);
      }

      window.roundtripSetMarkers = function (nextMarkers, showPolyline) {
        renderMarkers(parseMarkers(nextMarkers), Boolean(showPolyline));
      };

      function loadMap() {
        if (!window.kakao || !window.kakao.maps) {
          fail('Kakao Maps SDK가 초기화되지 않았습니다.');
          return;
        }

        window.kakao.maps.load(function () {
          const firstMarker = initialMarkers[0] || { lat: 37.5665, lng: 126.978 };
          const center = new window.kakao.maps.LatLng(firstMarker.lat, firstMarker.lng);
          map = new window.kakao.maps.Map(document.getElementById('map'), {
            center,
            level: 4,
          });

          renderMarkers(initialMarkers, initialShowPolyline);
          postMessage({ type: 'ready' });
        });
      }

      if (!appKey) {
        fail('Kakao JavaScript 키가 없습니다.');
      } else {
        const sdk = document.createElement('script');
        sdk.src =
          'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=' +
          encodeURIComponent(appKey);
        sdk.async = true;
        sdk.onload = loadMap;
        sdk.onerror = function () {
          fail('Kakao Maps SDK 로드 실패: JavaScript Key와 Web 플랫폼 도메인을 확인해주세요.');
        };
        document.head.appendChild(sdk);
      }
    </script>
  </body>
</html>`;
}

export function KakaoWebViewMap({ markers, showPolyline = false, style }: KakaoWebViewMapProps) {
  const theme = useAppTheme();
  const webViewRef = useRef<WebView>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const markerPayload = useMemo(
    () =>
      markers.map((marker) => ({
        id: marker.id,
        lat: marker.latitude,
        lng: marker.longitude,
        order: marker.order,
        title: marker.title ?? '',
      })),
    [markers],
  );

  const sourceHtml = useMemo(
    () => createMapHtml(KAKAO_JS_KEY ?? '', markerPayload, showPolyline),
    [markerPayload, showPolyline],
  );

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    webViewRef.current?.injectJavaScript(
      `window.roundtripSetMarkers(${JSON.stringify(markerPayload)}, ${JSON.stringify(
        showPolyline,
      )}); true;`,
    );
  }, [mapReady, markerPayload, showPolyline]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as MapMessage;

      if (data.type === 'ready') {
        setErrorMessage(null);
        setMapReady(true);
        return;
      }

      if (data.type === 'error') {
        setErrorMessage(data.message ?? 'Kakao 지도를 불러오지 못했습니다.');
      }
    } catch {
      setErrorMessage('Kakao 지도 상태를 확인하지 못했습니다.');
    }
  };

  if (!KAKAO_JS_KEY) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={[styles.fallbackText, { color: theme.semantic.textMuted }]}>
          Kakao JavaScript 키가 설정되지 않았습니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        domStorageEnabled
        javaScriptEnabled
        mixedContentMode="always"
        originWhitelist={['*']}
        source={{ baseUrl: KAKAO_MAP_BASE_URL, html: sourceHtml }}
        style={styles.webView}
        onError={(event) => setErrorMessage(event.nativeEvent.description)}
        onHttpError={(event) => setErrorMessage(`HTTP ${event.nativeEvent.statusCode}`)}
        onMessage={handleMessage}
      />
      {errorMessage ? (
        <View style={[styles.errorOverlay, { backgroundColor: theme.semantic.surface }]}>
          <Text style={[styles.fallbackText, { color: theme.semantic.textMuted }]}>
            {errorMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fallbackText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  webView: { backgroundColor: 'transparent', flex: 1 },
});
