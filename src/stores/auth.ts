import { create } from 'zustand';

import { issueTestToken, refreshToken } from '@/src/api/auth';
import { apiClient, attachAuthInterceptor, attachResponseInterceptor } from '@/src/api/client';
import { deleteMe, getMe } from '@/src/api/users';
import {
  loginWithGoogle,
  loginWithKakao,
  logoutSession,
  type LoginProvider,
} from '@/src/features/auth/login';
import {
  clearStoredTokens,
  getAccessToken,
  getJwtExpiresAt,
  getRefreshToken,
  getStoredTokens,
  setAccessToken,
  setStoredTokens,
} from '@/src/lib/tokenStore';

import type { AuthUser } from '@/src/api/auth/types';

type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  errorMessage: string | null;
  bootstrap: () => Promise<void>;
  login: (provider: LoginProvider) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearSession: () => Promise<void>;
};

let interceptorsInstalled = false;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const authTestSecret = process.env.EXPO_PUBLIC_AUTH_TEST_SECRET?.trim();

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

async function refreshAccessTokenWithStore(refreshTokenValue: string) {
  const response = await refreshToken({ refresh_token: refreshTokenValue });
  await setAccessToken(response.access_token);
  scheduleTokenRefresh(response.access_token);
  return response.access_token;
}

function scheduleTokenRefresh(accessToken: string) {
  clearRefreshTimer();

  const expiresAt = getJwtExpiresAt(accessToken);

  if (!expiresAt) {
    return;
  }

  const refreshAt = expiresAt - Date.now() - 60_000;

  if (refreshAt <= 0) {
    void refreshAccessTokenSoon();
    return;
  }

  refreshTimer = setTimeout(() => {
    void refreshAccessTokenSoon();
  }, refreshAt);
}

async function refreshAccessTokenSoon() {
  const refreshTokenValue = await getRefreshToken();

  if (!refreshTokenValue) {
    await useAuthStore.getState().clearSession();
    return;
  }

  try {
    await refreshAccessTokenWithStore(refreshTokenValue);
  } catch {
    await useAuthStore.getState().clearSession();
  }
}

async function bootstrapWithTestToken() {
  if (!authTestSecret) {
    return null;
  }

  const result = await issueTestToken({ secret: authTestSecret });

  await setStoredTokens({
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  });
  scheduleTokenRefresh(result.access_token);

  return result.user;
}

export function installAuthInterceptors() {
  if (interceptorsInstalled) {
    return;
  }

  attachAuthInterceptor(apiClient, {
    getAccessToken,
  });
  attachResponseInterceptor(apiClient, {
    getRefreshToken,
    refreshAccessToken: refreshAccessTokenWithStore,
    setAccessToken,
    onAuthFailure: () => useAuthStore.getState().clearSession(),
  });

  interceptorsInstalled = true;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  user: null,
  errorMessage: null,
  bootstrap: async () => {
    installAuthInterceptors();
    set({ status: 'checking', errorMessage: null });

    const tokens = await getStoredTokens();

    if (!tokens) {
      try {
        const testUser = await bootstrapWithTestToken();

        if (testUser) {
          set({ status: 'authenticated', user: testUser });
          return;
        }
      } catch {
        await clearStoredTokens();
        clearRefreshTimer();
      }

      set({ status: 'unauthenticated', user: null });
      return;
    }

    scheduleTokenRefresh(tokens.accessToken);

    try {
      const user = await getMe();

      set({
        status: 'authenticated',
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
          email: user.email,
          locale: user.locale,
          is_new_user: false,
          credit_balance: user.credit_balance,
        },
      });
    } catch {
      await clearStoredTokens();
      clearRefreshTimer();

      try {
        const testUser = await bootstrapWithTestToken();

        if (testUser) {
          set({ status: 'authenticated', user: testUser });
          return;
        }
      } catch {
        await clearStoredTokens();
        clearRefreshTimer();
      }

      set({ status: 'unauthenticated', user: null });
    }
  },
  login: async (provider) => {
    set({ status: 'checking', errorMessage: null });

    try {
      const result = provider === 'google' ? await loginWithGoogle() : await loginWithKakao();

      scheduleTokenRefresh(result.accessToken);
      set({ status: 'authenticated', user: result.user });
    } catch (error) {
      set({
        status: 'unauthenticated',
        errorMessage: error instanceof Error ? error.message : '로그인에 실패했습니다.',
      });
      throw error;
    }
  },
  logout: async () => {
    await logoutSession();
    clearRefreshTimer();
    set({ status: 'unauthenticated', user: null, errorMessage: null });
  },
  deleteAccount: async () => {
    await deleteMe();
    await logoutSession();
    clearRefreshTimer();
    set({ status: 'unauthenticated', user: null, errorMessage: null });
  },
  clearSession: async () => {
    await clearStoredTokens();
    clearRefreshTimer();
    set({ status: 'unauthenticated', user: null });
  },
}));
