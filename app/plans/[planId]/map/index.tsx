import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlanMapScreen() {
  return (
    <View style={styles.container}>
      {/*
        화면: 플랜 지도 스플릿 뷰 (S-07-M)
        기능: 플랜 장소 마커를 전체화면 지도에 표시하고 하단 시트에서 Day별 일정을 함께 확인한다.
        가능한 다음 이동 화면: S-05, S-07
      */}
      <View style={styles.map}>
        <Text style={styles.mapText}>플랜 지도</Text>
      </View>
      <Link href={'/plans/draft-plan' as Href} asChild>
        <TouchableOpacity style={styles.close}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Day별 장소</Text>
        <Text style={styles.chip}>Day 1 · 도쿄 감성 카페</Text>
        <Text style={styles.chip}>Day 2 · 시부야 디저트</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { alignItems: 'center', backgroundColor: '#D1D5DB', flex: 1, justifyContent: 'center' },
  mapText: { color: '#374151', fontSize: 24, fontWeight: '800' },
  close: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    left: 20,
    padding: 10,
    position: 'absolute',
    top: 56,
  },
  closeText: { color: '#111827', fontWeight: '900' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    bottom: 0,
    gap: 10,
    left: 0,
    padding: 18,
    position: 'absolute',
    right: 0,
  },
  sheetTitle: { color: '#111827', fontSize: 18, fontWeight: '800' },
  chip: {
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    color: '#9A3412',
    overflow: 'hidden',
    padding: 10,
  },
});
