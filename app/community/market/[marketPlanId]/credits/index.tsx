import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreditsAdScreen() {
  return (
    <View style={styles.container}>
      {/*
        화면: 광고 시청 / 크레딧 충전 (S-11MAD)
        기능: 크레딧 잔액, 광고 시청 진행 상태, 진행 바, 광고 보기와 닫기 액션을 제공한다.
        가능한 다음 이동 화면: S-11MP
      */}
      <Text style={styles.title}>크레딧 충전</Text>
      <Text style={styles.credit}>현재 크레딧 💎 0</Text>
      <Text style={styles.progress}>3/5 시청 완료</Text>
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>광고 보기</Text>
      </TouchableOpacity>
      <Text style={styles.help}>광고 5개를 보면 플랜 1개를 열어볼 수 있어요</Text>
      <Link href={'/community/market/sample-market-plan' as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>닫기</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, justifyContent: 'center', padding: 20 },
  title: { color: '#111827', fontSize: 26, fontWeight: '800', textAlign: 'center' },
  credit: { color: '#111827', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  progress: { color: '#6B7280', textAlign: 'center' },
  progressBar: { backgroundColor: '#E5E7EB', borderRadius: 8, height: 12, overflow: 'hidden' },
  progressFill: { backgroundColor: '#EA580C', height: 12, width: '60%' },
  primaryButton: { backgroundColor: '#EA580C', borderRadius: 8, padding: 15 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  help: { color: '#6B7280', textAlign: 'center' },
  secondaryButton: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 15 },
  secondaryButtonText: { color: '#111827', fontWeight: '800', textAlign: 'center' },
});
