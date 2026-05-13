import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        화면: 설정 (S-12)
        기능: 프로필, 계정 정보, 알림, 지도 공급자, 로그아웃과 계정 삭제 설정을 관리한다.
        가능한 다음 이동 화면: 없음
      */}
      <Text style={styles.title}>설정</Text>
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <View style={styles.profileText}>
          <Text style={styles.nickname}>이상한 여우 8237</Text>
          <Text style={styles.email}>user@example.com</Text>
        </View>
      </View>
      {[
        '프로필 사진 변경',
        '닉네임 변경',
        '알림 설정',
        '지도 공급자: Kakao / Google',
        '로그아웃',
        '계정 삭제',
      ].map((item) => (
        <TouchableOpacity key={item} style={styles.row}>
          <Text style={styles.rowText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, padding: 20, paddingTop: 64 },
  title: { color: '#111827', fontSize: 30, fontWeight: '800' },
  profile: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  avatar: { backgroundColor: '#FED7AA', borderRadius: 28, height: 56, width: 56 },
  profileText: { gap: 4 },
  nickname: { color: '#111827', fontSize: 18, fontWeight: '800' },
  email: { color: '#6B7280' },
  row: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16 },
  rowText: { color: '#111827', fontWeight: '700' },
});
