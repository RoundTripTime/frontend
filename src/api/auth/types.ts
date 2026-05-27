import type { ID } from '../common';

export type SocialProvider = 'google' | 'kakao';

export type AuthUser = {
  id: ID;
  nickname: string;
  avatar_url: string;
  email: string;
  locale: string;
  is_new_user: boolean;
  credit_balance: number;
};

export type SocialLoginRequest = {
  provider: SocialProvider;
  id_token: string;
};

export type SocialLoginResponse = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
};

export type TestTokenRequest = {
  secret: string;
};

export type TestTokenResponse = SocialLoginResponse;
