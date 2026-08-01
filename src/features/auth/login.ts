import Constants from 'expo-constants';

import { logout as requestLogout, socialLogin } from '@/src/api/auth';
import { shouldUseApiMocks } from '@/src/lib/appMode';
import { clearStoredTokens, setStoredTokens } from '@/src/lib/tokenStore';

import type { AuthUser, SocialLoginResponse } from '@/src/api/auth/types';
import type { MappedApiError } from '@/src/api/errorMap';

export type LoginProvider = 'google' | 'kakao';

export type LoginResult = {
  provider: LoginProvider;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

let googleConfigured = false;
const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY?.trim();

function canUseNativeSocialAuth() {
  return Constants.appOwnership !== 'expo';
}

async function loadGoogleSignIn() {
  if (!canUseNativeSocialAuth()) {
    throw new Error('Google 네이티브 로그인은 Expo Go가 아닌 dev build에서 사용할 수 있습니다.');
  }

  try {
    return await import('@react-native-google-signin/google-signin');
  } catch {
    throw new Error('Google 네이티브 로그인은 Expo Go가 아닌 dev build에서 사용할 수 있습니다.');
  }
}

async function loadKakaoLogin() {
  if (!canUseNativeSocialAuth()) {
    throw new Error('Kakao 네이티브 로그인은 Expo Go가 아닌 dev build에서 사용할 수 있습니다.');
  }

  if (!kakaoNativeAppKey) {
    throw new Error('Kakao Native App Key가 설정되지 않았습니다.');
  }

  try {
    return await import('@react-native-seoul/kakao-login');
  } catch {
    throw new Error('Kakao 네이티브 로그인은 Expo Go가 아닌 dev build에서 사용할 수 있습니다.');
  }
}

export async function configureGoogleSignIn() {
  const { GoogleSignin } = await loadGoogleSignIn();

  if (googleConfigured) {
    return GoogleSignin;
  }

  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
  googleConfigured = true;

  return GoogleSignin;
}

function toLoginResult(provider: LoginProvider, response: SocialLoginResponse): LoginResult {
  return {
    provider,
    user: response.user,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };
}

async function persistLogin(provider: LoginProvider, response: SocialLoginResponse) {
  await setStoredTokens({
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  });

  return toLoginResult(provider, response);
}

function createMockIdToken(provider: LoginProvider) {
  return `mock-${provider}-id-token`;
}

function getErrorText(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return '';
}

function isUserCancelledLogin(error: unknown) {
  const message = getErrorText(error).toLowerCase();
  return (
    message.includes('cancel') || message.includes('cancelled') || message.includes('canceled')
  );
}

function normalizeKakaoLoginError(error: unknown) {
  const mappedError = error as Partial<MappedApiError>;

  if (mappedError.code && mappedError.message) {
    return new Error(mappedError.message);
  }

  if (isUserCancelledLogin(error)) {
    return new Error('Kakao 로그인이 취소되었습니다.');
  }

  const message = getErrorText(error);

  if (message) {
    return new Error(`Kakao 로그인에 실패했습니다. ${message}`);
  }

  return new Error('Kakao 로그인에 실패했습니다.');
}

async function loginWithMockProvider(provider: LoginProvider) {
  return persistLogin(
    provider,
    await socialLogin({
      provider,
      id_token: createMockIdToken(provider),
    }),
  );
}

export async function loginWithGoogle() {
  if (shouldUseApiMocks()) {
    return loginWithMockProvider('google');
  }

  try {
    const { isCancelledResponse } = await loadGoogleSignIn();
    const GoogleSignin = await configureGoogleSignIn();

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    if (isCancelledResponse(response)) {
      throw new Error('Google 로그인이 취소되었습니다.');
    }

    const idToken = response.data.idToken;

    if (!idToken) {
      throw new Error('Google id_token을 가져오지 못했습니다.');
    }

    return persistLogin(
      'google',
      await socialLogin({
        provider: 'google',
        id_token: idToken,
      }),
    );
  } catch (error) {
    if (shouldUseApiMocks()) {
      return loginWithMockProvider('google');
    }

    throw error;
  }
}

export async function loginWithKakao() {
  if (shouldUseApiMocks()) {
    return loginWithMockProvider('kakao');
  }

  try {
    const { login: kakaoLogin } = await loadKakaoLogin();
    console.log('[Auth] Kakao native login start');
    const token = await kakaoLogin();
    const idToken = token.idToken?.trim();
    console.log('[Auth] Kakao native login success', {
      hasAccessToken: Boolean(token.accessToken),
      hasIdToken: Boolean(idToken),
      scopes: token.scopes,
    });

    if (!idToken) {
      throw new Error(
        'Kakao id_token을 가져오지 못했습니다. Kakao Developers에서 카카오 로그인과 OpenID Connect를 활성화해주세요.',
      );
    }

    console.log('[Auth] Kakao social login request');

    return persistLogin(
      'kakao',
      await socialLogin({
        provider: 'kakao',
        id_token: idToken,
      }),
    );
  } catch (error) {
    if (shouldUseApiMocks()) {
      return loginWithMockProvider('kakao');
    }

    throw normalizeKakaoLoginError(error);
  }
}

async function signOutGoogle() {
  if (shouldUseApiMocks() || !canUseNativeSocialAuth()) {
    return;
  }

  try {
    const { GoogleSignin } = await loadGoogleSignIn();
    await GoogleSignin.signOut();
  } catch {
    // Native modules can be unavailable in Expo Go. Local token cleanup still proceeds.
  }
}

async function signOutKakao() {
  if (shouldUseApiMocks() || !canUseNativeSocialAuth()) {
    return;
  }

  try {
    const { logout: kakaoLogout } = await loadKakaoLogin();
    await kakaoLogout();
  } catch {
    // Native modules can be unavailable in Expo Go. Local token cleanup still proceeds.
  }
}

export async function logoutSocialProviders() {
  await Promise.allSettled([signOutGoogle(), signOutKakao()]);
}

export async function logoutSession() {
  await Promise.allSettled([requestLogout(), logoutSocialProviders()]);
  await clearStoredTokens();
}
