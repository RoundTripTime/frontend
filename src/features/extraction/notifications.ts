import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const EXTRACTION_NOTIFICATION_CHANNEL_ID = 'roundtrip-extraction';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configureExtractionNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(EXTRACTION_NOTIFICATION_CHANNEL_ID, {
      importance: Notifications.AndroidImportance.DEFAULT,
      name: '장소 분석',
    });
  }

  const permission = await Notifications.getPermissionsAsync();

  if (permission.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function notifyExtractionCompleted(candidateCount: number) {
  const granted = await configureExtractionNotifications();

  if (!granted) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      body:
        candidateCount > 0
          ? `새 장소 후보가 ${candidateCount}개 있어요.`
          : '분석은 끝났지만 추출된 장소가 없어요.',
      data: { href: '/places/recent' },
      title: '링크 분석이 끝났어요',
    },
    trigger: null,
  });
}
