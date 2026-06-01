# Mock / MSW Decision

WF-07 이후 개발 환경에서는 Axios mock adapter를 도입한다.

목표:

- 화면과 store는 `src/api` 함수와 Axios 인스턴스를 그대로 호출한다.
- `APP_ENV=development`와 `APP_ENV=preview`에서는 Axios adapter가 요청/응답을 가로채 `docs/TDD/API spec.md` 기준 fixture를 반환한다.
- `APP_ENV=production`에서는 mock adapter를 설치하지 않고 실제 API 서버로 요청을 보낸다.

구성:

- `src/mocks/fixtures.ts`: 공통 fixture 데이터
- `src/mocks/handlers.ts`: API spec 기반 mock route resolver
- `src/mocks/index.ts`: Axios mock adapter 설치 함수
