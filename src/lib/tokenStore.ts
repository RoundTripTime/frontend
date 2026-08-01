import * as SecureStore from 'expo-secure-store';

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_TOKEN_KEY = 'roundtrip.accessToken';
const REFRESH_TOKEN_KEY = 'roundtrip.refreshToken';

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getStoredTokens(): Promise<StoredTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([getAccessToken(), getRefreshToken()]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export async function setAccessToken(accessToken: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
}

export async function setStoredTokens(tokens: StoredTokens) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function clearStoredTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}

export function getJwtExpiresAt(token: string): number | null {
  const [, payload] = token.split('.');

  if (!payload || typeof globalThis.atob !== 'function') {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const decoded = JSON.parse(globalThis.atob(padded)) as { exp?: unknown };

    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}
