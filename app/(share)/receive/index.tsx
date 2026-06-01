import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useShareReceiveController } from '@/src/features/share/useShareReceiveController';
import { useAppTheme, type AppTheme } from '@/src/theme';

export default function ShareReceiveScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { canSubmit, isSubmitting, message, setUrl, submitUrl, url } = useShareReceiveController();

  return (
    <View style={styles.container}>
      <DevScreenHeader screenName="링크 수신 / 분석 중" screenNumber="S-03" />
      {/*
        화면: 링크 수신 / 분석 중 (S-03)
        기능: iOS Share Extension / Android Share Intent로 전달된 URL을 백엔드에 제출해 장소 분석 잡을 생성한다. 개발 단계에서는 URL 입력과 제출 버튼으로 공유 intent 진입을 시뮬레이션한다.
        가능한 다음 이동 화면: S-02, S-04
      */}
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
        inputMode="url"
        onChangeText={setUrl}
        placeholder="공유 URL을 입력하세요"
        placeholderTextColor={theme.semantic.placeholder}
        style={styles.input}
        value={url}
      />
      <TouchableOpacity
        disabled={!canSubmit}
        onPress={() => {
          void submitUrl();
        }}
        style={[styles.submitButton, !canSubmit && styles.disabledButton]}
      >
        <Text style={styles.submitButtonText}>{isSubmitting ? '제출 중' : '제출'}</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Link href={'/' as Href} style={styles.link}>
        앱으로 돌아가기
      </Link>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.semantic.background,
      alignItems: 'center',
      flex: 1,
      gap: 14,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      backgroundColor: theme.semantic.input,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      color: theme.semantic.text,
      paddingHorizontal: 12,
      paddingVertical: 12,
      width: '100%',
    },
    submitButton: {
      backgroundColor: theme.semantic.primary,
      borderRadius: 8,
      padding: 13,
      width: '100%',
    },
    submitButtonText: {
      color: theme.semantic.onPrimary,
      fontWeight: '800',
      textAlign: 'center',
    },
    disabledButton: { opacity: 0.5 },
    message: { color: theme.semantic.textSecondary, fontWeight: '700', textAlign: 'center' },
    link: { color: theme.semantic.textMuted, fontWeight: '700' },
  });
