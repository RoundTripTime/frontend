import type { ID, ISODateTime, PaginatedResponse } from '../common';

export type CreditBalance = {
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
};

export type CreditType = 'ad_view' | 'ota_booking' | 'plan_sale' | 'plan_purchase' | 'ota_payment';

export type CreditHistoryItem = {
  history_id: ID;
  credit_type: CreditType;
  amount: number;
  balance_after: number;
  description: string;
  created_at: ISODateTime;
};

export type CreditHistoryResponse = PaginatedResponse<CreditHistoryItem>;

export type StartAdResponse = {
  ad_session_id: ID;
  ad_url: string;
  expires_at: ISODateTime;
  viewed_today: number;
  required_for_credit: number;
};

export type CompleteAdRequest = {
  ad_session_id: ID;
};

export type CompleteAdResponse = {
  viewed_today: number;
  required_for_credit: number;
  credit_earned: boolean;
  balance: number;
};
