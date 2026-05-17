# Mock / MSW Decision

WF-07 이후 개발 환경에서는 Axios mock adapter를 도입한다.

목표:

- 화면과 store는 `src/api` 함수와 Axios 인스턴스를 그대로 호출한다.
- 개발 환경에서는 Axios adapter가 요청/응답을 가로채 `docs/TDD/API spec.md` 기준 fixture를 반환한다.
- `EXPO_PUBLIC_USE_API_MOCKS=false`이면 mock adapter를 비활성화하고 실제 API 서버로 요청을 보낸다.

구성:

- `src/mocks/fixtures.ts`: 공통 fixture 데이터
- `src/mocks/handlers.ts`: API spec 기반 mock route resolver
- `src/mocks/index.ts`: Axios mock adapter 설치 함수
- `mocks/handlers.ts`: WF-07 산출물 경로용 핸들러 재수출
