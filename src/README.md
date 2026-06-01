# Source Guide

`src/`는 Expo Router 화면 밖의 앱 코드를 둔다.

## 폴더 역할

- `api`: Axios client, API 함수, TanStack Query hook, API type
- `components`: 여러 화면에서 쓰는 공통 UI
- `features`: 특정 도메인의 view model, 화면 계산 모델, feature-local logic
- `hooks`: 앱 공통 React hook
- `lib`: logger, query client, token store, global handler 같은 런타임 유틸
- `mocks`: development/preview API mock
- `stores`: Zustand client state
- `theme`: color, typography, semantic token, theme hook

## 상태 분류

- 서버 상태: TanStack Query
- 클라이언트 세션/임시 UI 상태: Zustand 또는 component state
- URL/route 상태: Expo Router params
- 폼 draft: component state, 필요 시 별도 hook

서버에서 다시 가져올 수 있는 데이터를 장기적으로 Zustand에 저장하지 않는다. 다만 development 시연용 seed나 share intent 직후의 임시 job 상태처럼 앱 내부에서 보존해야 하는 값은 예외로 둔다.

## Import 기준

- `@/src/...` alias를 우선 사용한다.
- 화면에서 `src/mocks`를 직접 import하지 않는다.
- mock 데이터는 `src/mocks/handlers.ts` 또는 development seed에서만 사용한다.
- 도메인 계산 로직은 화면 파일에 길게 두지 말고 `src/features/<domain>`으로 분리한다.
