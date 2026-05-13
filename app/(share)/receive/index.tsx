import { Link, type Href } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ShareReceiveScreen() {
  return (
    <View style={styles.container}>
      {/*
        화면: 링크 수신 / 분석 중 (S-03)
        기능: 공유된 링크 분석이 백그라운드에서 시작되었음을 안내하고 홈으로 복귀할 수 있게 한다.
        가능한 다음 이동 화면: S-02, S-04
      */}
      <View style={styles.preview}>
        <Text style={styles.platform}>YouTube</Text>
        <Text style={styles.url}>https://example.com/travel-vlog</Text>
      </View>
      <ActivityIndicator color="#EA580C" size="large" />
      <Text style={styles.message}>장소를 찾고 있어요. 잠시 후 알려드릴게요.</Text>
      <Link href={'/' as Href} style={styles.link}>
        앱으로 돌아가기
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, gap: 22, justifyContent: 'center', padding: 20 },
  preview: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 16, width: '100%' },
  platform: { color: '#EA580C', fontWeight: '800' },
  url: { color: '#374151' },
  message: { color: '#111827', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  link: { color: '#6B7280', fontWeight: '700' },
});
