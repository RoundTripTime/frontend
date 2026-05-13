import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 온보딩 (S-01)
        기능: 여행 영감 저장, 장소 자동 추출, 일정 생성 및 예약 가치를 소개하고 소셜 로그인을 유도한다.
        가능한 다음 이동 화면: S-02
      */}
      <Text style={styles.title}>여행 영감을 바로 일정으로</Text>
      {['여행 영감 저장', '장소 자동 추출', '일정 생성 및 예약'].map((copy, index) => (
        <View key={copy} style={styles.slide}>
          <Text style={styles.slideIndex}>{index + 1}</Text>
          <Text style={styles.slideTitle}>{copy}</Text>
        </View>
      ))}
      <Link href={'/' as Href} asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Google로 시작하기</Text>
        </TouchableOpacity>
      </Link>
      <Link href={'/' as Href} asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Kakao로 시작하기</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 20, paddingTop: 64 },
  title: { color: '#111827', fontSize: 30, fontWeight: '800' },
  slide: { backgroundColor: '#FFFFFF', borderRadius: 8, gap: 10, padding: 18 },
  slideIndex: { color: '#EA580C', fontSize: 18, fontWeight: '800' },
  slideTitle: { color: '#111827', fontSize: 20, fontWeight: '800' },
  primaryButton: { backgroundColor: '#111827', borderRadius: 8, marginTop: 12, padding: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  secondaryButton: { backgroundColor: '#FEE500', borderRadius: 8, padding: 16 },
  secondaryButtonText: { color: '#111827', fontWeight: '800', textAlign: 'center' },
});
