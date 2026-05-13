import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MarketRegisterScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 플랜 마켓 등록 (S-11MR)
        기능: OTA 예약 완료 플랜을 선택하고 제목, 소개, 장단점, 팁 입력 후 마켓에 등록한다.
        가능한 다음 이동 화면: S-11M
      */}
      <Text style={styles.title}>마켓 등록</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>도쿄 여름 여행</Text>
        <Text style={styles.badge}>✈️ OTA 예약 완료</Text>
      </View>
      {['제목', '한 줄 소개', '소개', '좋았던 점', '아쉬웠던 점', '추가 팁'].map((field) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{field}</Text>
          <Text style={styles.placeholder}>입력</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>등록 완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, padding: 20, paddingTop: 32 },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 14 },
  cardTitle: { color: '#111827', fontWeight: '800' },
  badge: { color: '#EA580C', fontWeight: '800' },
  field: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 8, padding: 14 },
  label: { color: '#111827', fontWeight: '800' },
  placeholder: { color: '#9CA3AF' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 15 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
});
