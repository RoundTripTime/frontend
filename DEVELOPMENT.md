# RoundTrip Frontend Development Guide

새 개발자나 에이전트는 작업 전 이 문서를 먼저 읽는다. 개인 작업 방식은 `AGENTS.md`에 두며 저장소에는 올리지 않는다.

## 1. 로컬 실행

필수 버전:

- Node: `.nvmrc` 기준 `20.19.x`
- npm: `10.x`

```bash
nvm use
npm install
cp .env.example .env
npm start
```

Expo Go에서 시작할 수 있지만, Google/Kakao native module, share extension, background task처럼 native binary가 필요한 기능은 dev build가 필요하다.

## 2. 환경 모드

`APP_ENV`는 `.env`에서만 바꾼다.

- `development`: API mock ON, 개발 화면명 overlay ON
- `preview`: API mock ON, 개발 화면명 overlay OFF
- `production`: API mock OFF, 실제 API 호출

새 개발자가 UI/기능을 빠르게 확인할 때는 `APP_ENV=development`를 권장한다. 실제 서버 디버깅은 `APP_ENV=production`과 테스트 토큰 설정을 사용한다.

## 3. 최소 확인 명령

작업 후 아래 명령은 기본으로 확인한다.

```bash
npm run typecheck
npm run lint
```

커밋 시 Husky/lint-staged가 staged 파일에 대해 ESLint와 Prettier를 자동 실행한다.

## 4. 먼저 읽을 문서

- `README.md`: 설치와 명령
- `git.md`: 브랜치/커밋/PR 규칙
- `app/README.md`: Expo Router 화면 구조
- `src/README.md`: 코드 계층 구조
- `src/api/README.md`: API, query, mutation 정책
- `src/mocks/README.md`: development/preview mock 정책
- `docs/TDD/API spec.md`: 서버 계약
- `docs/TDD/Screen Specs.md`: 화면 요구사항
- `docs/TDD/Screen Flow.md`: 화면 이동
- `docs/TDD/Pipeline.md`: URL 분석 파이프라인

## 5. 현재 개발 우선순위

시연용 mock 개발보다 실제 개발 환경을 우선한다.

1. 실제 API 연동 디버깅
2. 공유 시트 / share intent dev build 구현
3. foreground/background job polling 또는 push 전환
4. 후보 장소 처리 → 내 장소 반영
5. 플랜 생성/편집 저장 안정화

## 6. 주의할 점

- `.env`는 커밋하지 않는다.
- `.env.example`에는 실제 secret을 넣지 않는다.
- `EXPO_PUBLIC_*` 값은 클라이언트 번들에 포함된다.
- native module 오류가 Expo Go에서 발생하면 코드 문제가 아니라 dev build 필요 여부를 먼저 확인한다.
- `docs/`는 이제 협업 컨텍스트로 추적한다. 문서 수정이 코드 계약을 바꾸는 경우 관련 코드도 같이 확인한다.
