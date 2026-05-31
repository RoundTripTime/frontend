import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { VideoView, useVideoPlayer, type VideoSource } from 'expo-video';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import { useAuthStore } from '@/src/stores/auth';
import { useAppTheme, type AppTheme } from '@/src/theme';

type OnboardingBackgroundMedia =
  | {
      source: VideoSource;
      type: 'video';
    }
  | {
      source: ImageSource;
      type: 'image';
    };

const backgroundMedia: OnboardingBackgroundMedia = {
  source: require('../../../assets/videos/onboarding-travel.mp4') as VideoSource,
  type: 'video',
};

export default function OnboardingScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const isLoading = status === 'checking';

  const handleLogin = async (provider: 'google' | 'kakao') => {
    await login(provider);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <OnboardingBackground media={backgroundMedia} styles={styles} />
      <View style={styles.scrim} />
      <DevScreenHeader screenName="온보딩" screenNumber="S-01" />
      {/*
        화면: 온보딩 (S-01)
        기능: 여행 영감 저장, 장소 자동 추출, 일정 생성 및 예약 가치를 소개하고 소셜 로그인을 유도한다.
        가능한 다음 이동 화면: S-02
      */}
      <View style={styles.contentLayer}>
        <View style={styles.copyGroup}>
          <Text style={styles.brand}>RoundTrip</Text>
          <Text style={styles.title}>{'떠나고 싶은\n모든 순간을,\n한 번의 공유로.'}</Text>
          <Text style={styles.subtitle}>
            {'인스타, 유튜브 링크를 공유하세요.\nAI가 장소를 자동으로 추가해줘요.'}
          </Text>
        </View>

        <View style={styles.actionGroup}>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <TouchableOpacity
            disabled={isLoading}
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={() => {
              void handleLogin('google');
            }}
          >
            <Text style={styles.primaryButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            style={[styles.secondaryButton, isLoading && styles.disabledButton]}
            onPress={() => {
              void handleLogin('kakao');
            }}
          >
            <Text style={styles.secondaryButtonText}>Kakao로 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

type OnboardingBackgroundProps = {
  media: OnboardingBackgroundMedia;
  styles: ReturnType<typeof createStyles>;
};

function OnboardingBackground({ media, styles }: OnboardingBackgroundProps) {
  if (media.type === 'image') {
    return <Image contentFit="cover" source={media.source} style={styles.backgroundMedia} />;
  }

  return <OnboardingVideoBackground source={media.source} styles={styles} />;
}

function OnboardingVideoBackground({
  source,
  styles,
}: {
  source: VideoSource;
  styles: ReturnType<typeof createStyles>;
}) {
  const player = useVideoPlayer(source, (nextPlayer) => {
    nextPlayer.loop = true;
    nextPlayer.muted = true;
    nextPlayer.play();
  });

  return (
    <VideoView
      contentFit="cover"
      nativeControls={false}
      player={player}
      style={styles.backgroundMedia}
    />
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    actionGroup: { gap: 12 },
    backgroundMedia: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: '100%',
    },
    brand: {
      color: theme.semantic.onPrimary,
      fontSize: 18,
      fontWeight: '900',
      letterSpacing: 0,
    },
    container: {
      backgroundColor: theme.semantic.background,
      flex: 1,
    },
    contentLayer: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: 42,
      paddingHorizontal: 22,
      paddingTop: 118,
    },
    copyGroup: { gap: 14 },
    error: {
      backgroundColor: 'rgba(255,255,255,0.88)',
      borderRadius: 8,
      color: theme.semantic.danger,
      fontWeight: '800',
      padding: 12,
      textAlign: 'center',
    },
    primaryButton: {
      backgroundColor: theme.semantic.onPrimary,
      borderRadius: 8,
      padding: 16,
    },
    primaryButtonText: {
      color: theme.semantic.primaryDeep,
      fontWeight: '900',
      textAlign: 'center',
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(4, 13, 28, 0.36)',
    },
    secondaryButton: { backgroundColor: theme.semantic.kakao, borderRadius: 8, padding: 16 },
    secondaryButtonText: { color: theme.semantic.text, fontWeight: '900', textAlign: 'center' },
    subtitle: {
      color: 'rgba(255,255,255,0.88)',
      fontSize: 17,
      fontWeight: '700',
      lineHeight: 25,
      maxWidth: 330,
    },
    title: {
      color: theme.semantic.onPrimary,
      fontSize: 42,
      fontWeight: '900',
      lineHeight: 49,
      maxWidth: 330,
    },
    disabledButton: { opacity: 0.5 },
  });
