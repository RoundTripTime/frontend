import { logout as requestLogout, socialLogin } from '@/src/api/auth';
import { clearStoredTokens, setStoredTokens } from '@/src/lib/tokenStore';
import { shouldUseApiMocks } from '@/src/mocks';

import type { AuthUser, SocialLoginResponse } from '@/src/api/auth/types';

export type LoginProvider = 'google' | 'kakao';

export type LoginResult = {
  provider: LoginProvider;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

let googleConfigured = false;

async function loadGoogleSignIn() {
  try {
    return await import('@react-native-google-signin/google-signin');
  } catch {
    throw new Error('Google 네이티브 로그인은 Expo Go가 아닌 dev build에서 사용할 수 있습니다.');
  }
}

async function loadKakaoLogin() {
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
    const token = await kakaoLogin();

    if (!token.idToken) {
      throw new Error('Kakao id_token을 가져오지 못했습니다.');
    }

    return persistLogin(
      'kakao',
      await socialLogin({
        provider: 'kakao',
        id_token: token.idToken,
      }),
    );
  } catch (error) {
    if (shouldUseApiMocks()) {
      return loginWithMockProvider('kakao');
    }

    throw error;
  }
}

async function signOutGoogle() {
  try {
    const { GoogleSignin } = await loadGoogleSignIn();
    await GoogleSignin.signOut();
  } catch {
    // Native modules can be unavailable in Expo Go. Local token cleanup still proceeds.
  }
}

async function signOutKakao() {
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
