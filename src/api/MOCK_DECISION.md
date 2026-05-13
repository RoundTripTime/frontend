# Mock / MSW Decision

WF-07 기준으로 현재는 MSW를 도입하지 않는다.

이유:

- API spec은 REST 계약을 정의하지만 백엔드 준비 여부와 실제 응답 fixture 범위가 아직 산출물에 포함되어 있지 않다.
- 프로젝트에 MSW 의존성이 없으므로 이번 workflow에서 `mocks/handlers.ts`를 추가하면 별도 패키지 설치와 런타임 연결 범위가 커진다.
- 현재 산출물은 `src/api` 레이어의 타입, Axios 호출 함수, React Query 훅 표준화가 목적이다.

후속 도입 기준:

- 화면별 fixture가 정해지거나 백엔드 미준비 화면을 로컬에서 독립 검증해야 할 때 MSW를 추가한다.
- 도입 시 `mocks/handlers.ts`는 이 API 함수 모듈의 경로와 응답 타입을 기준으로 작성한다.
