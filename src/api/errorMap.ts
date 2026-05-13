import { AxiosError } from 'axios';

import type { ApiErrorBody } from './common';

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE'
  | 'INTERNAL_ERROR'
  | 'PLACE_NOT_FOUND'
  | 'UNSUPPORTED_PLATFORM'
  | 'DUPLICATE_LINK'
  | 'INSUFFICIENT_CREDITS'
  | 'OTA_NOT_VERIFIED'
  | 'ALREADY_LISTED'
  | 'AD_LIMIT_REACHED'
  | 'INVALID_AD_SESSION'
  | 'AD_ALREADY_COMPLETED';

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION_ERROR: '요청 값을 확인해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 정보를 찾을 수 없습니다.',
  CONFLICT: '이미 처리된 요청입니다.',
  UNPROCESSABLE: '현재 처리할 수 없는 상태입니다.',
  INTERNAL_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  PLACE_NOT_FOUND: '해당 장소를 찾을 수 없습니다.',
  UNSUPPORTED_PLATFORM: '지원하지 않는 링크입니다.',
  DUPLICATE_LINK: '이미 처리 중인 링크입니다.',
  INSUFFICIENT_CREDITS: '크레딧이 부족합니다.',
  OTA_NOT_VERIFIED: 'OTA 예약 완료 플랜만 등록할 수 있습니다.',
  ALREADY_LISTED: '이미 마켓에 등록된 플랜입니다.',
  AD_LIMIT_REACHED: '오늘 광고 시청 한도에 도달했습니다.',
  INVALID_AD_SESSION: '광고 세션이 만료되었거나 유효하지 않습니다.',
  AD_ALREADY_COMPLETED: '이미 완료 처리된 광고입니다.',
};

export type MappedApiError = {
  code: string;
  message: string;
  status?: number;
  raw?: unknown;
};

export function getErrorMessage(code?: string, fallback?: string) {
  if (code && code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code as ApiErrorCode];
  }

  return fallback ?? '알 수 없는 오류가 발생했습니다.';
}

export function mapApiError(error: unknown): MappedApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const body = error.response?.data as ApiErrorBody | undefined;
    const code = body?.error?.code ?? `HTTP_${status ?? 'UNKNOWN'}`;

    return {
      code,
      message: getErrorMessage(body?.error?.code, body?.error?.message ?? error.message),
      status,
      raw: error,
    };
  }

  if (error instanceof Error) {
    return { code: 'UNKNOWN', message: error.message, raw: error };
  }

  return { code: 'UNKNOWN', message: getErrorMessage(), raw: error };
}
