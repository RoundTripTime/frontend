import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlaceDetailScreen() {
  return (
    <View style={styles.container}>
      {/*
        화면: 장소 상세 (S-05)
        기능: 지도, 정규화된 장소 정보, 외부 지도 연결, 원본 영상 이동, 추출 근거와 수락/거절 액션을 제공한다.
        가능한 다음 이동 화면: S-02
      */}
      <View style={styles.map}>
        <Text style={styles.mapText}>지도</Text>
      </View>
      <Text style={styles.title}>도쿄 감성 카페</Text>
      <Text style={styles.meta}>카페 · 일본 도쿄 시부야</Text>
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
        <Text style={styles.body}>도쿄 맛집 VLOG · 영상 보러 가기</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추출 근거</Text>
        <Text style={styles.body}>영상에서 장소명이 언급된 구간과 지도 정보를 기준으로 추출됨</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.accept}>
          <Text style={styles.acceptText}>수락</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reject}>
          <Text style={styles.rejectText}>거절</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, padding: 20 },
  map: {
    alignItems: 'center',
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    height: 220,
    justifyContent: 'center',
  },
  mapText: { color: '#374151', fontWeight: '800' },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  meta: { color: '#6B7280' },
  row: { flexDirection: 'row', gap: 10 },
  outlineButton: { borderColor: '#D1D5DB', borderRadius: 8, borderWidth: 1, flex: 1, padding: 12 },
  outlineText: { color: '#111827', fontWeight: '700', textAlign: 'center' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 14 },
  sectionTitle: { color: '#111827', fontSize: 16, fontWeight: '800' },
  body: { color: '#374151', lineHeight: 20 },
  accept: { backgroundColor: '#16A34A', borderRadius: 8, flex: 1, padding: 14 },
  acceptText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  reject: { backgroundColor: '#F3F4F6', borderRadius: 8, flex: 1, padding: 14 },
  rejectText: { color: '#DC2626', fontWeight: '800', textAlign: 'center' },
});
