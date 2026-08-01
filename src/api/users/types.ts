import type { ID, ISODateTime } from '../common';

export type MapProvider = 'kakao' | 'google';

export type UserProfile = {
  id: ID;
  nickname: string;
  avatar_url: string;
  email: string;
  locale: string;
  home_region: string;
  map_provider: MapProvider;
  credit_balance: number;
  created_at: ISODateTime;
};

export type UpdateUserProfileRequest = Partial<
  Pick<UserProfile, 'nickname' | 'avatar_url' | 'home_region' | 'locale' | 'map_provider'>
>;
