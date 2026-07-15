import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useAppTheme } from '@/src/theme';

const ANDROID_MAP_HTML_URI = 'file:///android_asset/kakao-place-map.html';
const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY;

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

  const sourceUri = useMemo(() => {
    const params = new URLSearchParams({
      appKey: KAKAO_JS_KEY ?? '',
      markers: JSON.stringify(markerPayload),
      showPolyline: showPolyline ? 'true' : 'false',
    });

    return `${ANDROID_MAP_HTML_URI}?${params.toString()}`;
  }, []);

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
        source={{ uri: sourceUri }}
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
