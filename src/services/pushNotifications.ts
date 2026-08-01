import * as Notifications from 'expo-notifications';
import { Alert, Platform, ToastAndroid } from 'react-native';

import { registerDeviceToken, unregisterDeviceToken } from '@/src/api/notifications';

import type { DeviceTokenPlatform } from '@/src/api/notifications/types';

type ApiErrorLike = {
  code?: string;
  status?: number;
};

type DeviceTokenRegistrationOptions = {
  showToast?: boolean;
};

let registeredDeviceToken: string | null = null;

export async function registerCurrentDeviceToken(options: DeviceTokenRegistrationOptions = {}) {
  const platform = getDeviceTokenPlatform();

  if (!platform) {
    return;
  }

  const permission = await Notifications.getPermissionsAsync();
  const granted = permission.granted || (await Notifications.requestPermissionsAsync()).granted;

  if (!granted) {
    showOptionalToast(options, 'FCM 알림 권한이 필요합니다');
    return;
  }

  let token: string;

  try {
    const deviceToken = await Notifications.getDevicePushTokenAsync();
    token = String(deviceToken.data);
  } catch (error) {
    console.warn('[FCM] device token issue failed', error);
    showOptionalToast(options, 'FCM 토큰 발급 실패');
    return;
  }

  await registerKnownDeviceToken(token, options);
}

export async function registerKnownDeviceToken(
  token: string,
  options: DeviceTokenRegistrationOptions = {},
) {
  const platform = getDeviceTokenPlatform();

  if (!platform || registeredDeviceToken === token) {
    return;
  }

  try {
    await registerDeviceToken({ platform, token });
    registeredDeviceToken = token;
    showOptionalToast(options, 'FCM 등록 성공');
  } catch (error) {
    console.warn('[FCM] device token registration failed', error);
    showOptionalToast(options, getDeviceTokenRegistrationFailureMessage(error));
  }
}

export async function unregisterCurrentDeviceToken() {
  const token = registeredDeviceToken;

  if (!token) {
    return;
  }

  try {
    await unregisterDeviceToken({ token });
  } catch (error) {
    console.warn('[FCM] device token unregister failed', error);
  } finally {
    registeredDeviceToken = null;
  }
}

export function addDeviceTokenRegistrationListener(options: DeviceTokenRegistrationOptions = {}) {
  return Notifications.addPushTokenListener((token) => {
    void registerKnownDeviceToken(String(token.data), options);
  });
}

function getDeviceTokenPlatform(): DeviceTokenPlatform | null {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return Platform.OS;
  }

  return null;
}

function getDeviceTokenRegistrationFailureMessage(error: unknown) {
  const apiError = error as ApiErrorLike;

  if (apiError.status === 401 || apiError.status === 403) {
    return 'FCM 인증 실패: 앱에 다시 로그인해주세요';
  }

  if (apiError.status === 400 || apiError.status === 422 || apiError.code === 'VALIDATION_ERROR') {
    return 'FCM 서버 등록 실패: 토큰 값을 확인해주세요';
  }

  if ((apiError.status ?? 0) >= 500 || apiError.code === 'INTERNAL_ERROR') {
    return 'FCM 서버 등록 실패';
  }

  return 'FCM 서버 등록 실패';
}

function showOptionalToast(options: DeviceTokenRegistrationOptions, message: string) {
  if (!options.showToast) {
    return;
  }

  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert('알림', message);
}
