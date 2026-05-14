import { GoogleSignin, isCancelledResponse } from '@react-native-google-signin/google-signin';
import { login as kakaoLogin, logout as kakaoLogout } from '@react-native-seoul/kakao-login';

import { logout as requestLogout, socialLogin } from '@/src/api/auth';
import { clearStoredTokens, setStoredTokens } from '@/src/lib/tokenStore';

import type { AuthUser, SocialLoginResponse } from '@/src/api/auth/types';

export type LoginProvider = 'google' | 'kakao';

export type LoginResult = {
  provider: LoginProvider;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

let googleConfigured = false;

export function configureGoogleSignIn() {
  if (googleConfigured) {
    return;
  }

  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
  googleConfigured = true;
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

export async function loginWithGoogle() {
  configureGoogleSignIn();

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
}

export async function loginWithKakao() {
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
}

export async function logoutSocialProviders() {
  await Promise.allSettled([GoogleSignin.signOut(), kakaoLogout()]);
}

export async function logoutSession() {
  await Promise.allSettled([requestLogout(), logoutSocialProviders()]);
  await clearStoredTokens();
}
