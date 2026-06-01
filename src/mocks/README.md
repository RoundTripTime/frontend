# Mock Guide

`src/mocks`는 development/preview 환경에서 API 서버 없이 화면을 개발하기 위한 Axios mock 레이어다.

## 모드별 정책

- `development`: mock ON, DevScreenOverlay ON
- `preview`: mock ON, DevScreenOverlay OFF
- `production`: mock OFF

정책은 `app.config.ts`의 `APP_ENV_MODES`에서 관리한다.

## 파일 역할

- `fixtures.ts`: 정적인 기본 데이터
- `db.ts`: mutable mock DB와 helper
- `handlers.ts`: API route resolver
- `index.ts`: Axios adapter 설치

## 주의사항

- 화면 코드에서 mock DB를 직접 import하지 않는다.
- mock 응답 구조는 `docs/TDD/API spec.md`를 따른다.
- 서버 API와 다르게 mock만 동작하는 기능을 만들지 않는다.
- development seed가 필요한 경우 store에서 명시적으로 `APP_ENV=development` 조건을 둔다.

## 현재 development seed

`src/stores/placeCandidates.ts`는 development에서 S-04 후보 진입을 쉽게 하기 위해 mock 후보를 초기 seed한다. production/preview에서는 URL 제출 또는 서버 응답을 통해서만 후보가 생겨야 한다.
