# API Layer Guide

API 레이어는 실제 서버 호출 형태를 기준으로 작성한다. 협업 개발의 기본 환경은 EAS development build + `APP_ENV=production`이며, mock adapter는 기본 개발 경로가 아니다.

## 파일 구조

- `client.ts`: Axios instance, base URL, interceptor, network logging, mock bootstrap
- `<domain>.ts`: 실제 API 함수
- `<domain>/types.ts`: request/response type
- `<domain>/hooks.ts`: TanStack Query query/mutation hook
- `errorMap.ts`: 서버 error code → 사용자 메시지
- `MOCK_DECISION.md`: mock 정책 기록

## 개발 원칙

- 화면은 Axios를 직접 호출하지 않고 hook 또는 API 함수를 사용한다.
- query key는 `hooks.ts`의 `*Keys` 객체에 모은다.
- mutation 성공 후에는 invalidate 또는 `queryClient.setQueryData` 중 하나를 명확히 선택한다.
- `APP_ENV=production`에서는 mock adapter를 설치하지 않는다.
- 신규 기능은 mock이 아니라 실제 API 호출과 서버 응답을 기준으로 구현한다.
- API spec과 다른 임시 필드가 필요하면 TODO로 남기기보다 `docs/TDD/API spec.md` 수정 논의가 먼저다.

## 디버깅

API 로그는 request/response interceptor에서 출력한다. 민감한 값은 redaction되어야 한다.

확인 순서:

1. `APP_ENV=production` 여부 확인
2. `EXPO_PUBLIC_API_BASE_URL` 확인
3. API 로그의 method/url/status 확인
4. `src/api/errorMap.ts` 매핑 확인
5. mock 환경이면 `src/mocks/handlers.ts` resolver 확인
