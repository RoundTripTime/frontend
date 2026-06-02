# RoundTrip Frontend Development Guide

새 개발자나 에이전트는 작업 전 이 문서를 먼저 읽는다. 개인 작업 방식은 `AGENTS.md`에 두며 저장소에는 올리지 않는다.

## 1. 표준 개발 방식

필수 버전:

- Node: `.nvmrc` 기준 `20.19.x`
- npm: `10.x`
- EAS CLI: `npm install -g eas-cli`

```bash
nvm use
npm install
cp .env.example .env
```

이 프로젝트의 표준 실행 환경은 **Expo Go가 아니라 EAS development build**다. Google/Kakao native module, 공유 시트, push notification, background fetch는 Expo Go에서 충분히 검증할 수 없다.

처음 한 번 또는 native 설정이 바뀐 경우:

```bash
eas login
eas build --profile development --platform ios
eas build --profile development --platform android
```

기기에 development build를 설치한 뒤 평소 개발:

```bash
npm run start:dev
```

각 개발자는 자기 브랜치에서 Metro를 띄우고, 폰에 설치된 Round Trip dev build 앱을 열어 현재 로컬 코드를 테스트한다.

## 2. EAS build profile

`eas.json`은 현재 배포가 아니라 협업 개발을 위해 두 profile만 사용한다.

- `development`: 개발자용 dev client. Metro에 연결해서 JS/TS 변경을 빠르게 확인한다.
- `preview`: Metro 없이 단독 실행되는 내부 QA/시연용 빌드.

두 profile 모두 `APP_ENV=production`, `EXPO_PUBLIC_API_BASE_URL=https://roundtrip.duckdns.org`로 고정되어 mock 없이 실서버를 호출한다.

현재는 개발판/배포판 앱 ID를 분리하지 않는다.

- iOS bundle id: `com.roundtriptime.roundtrip`
- Android package: `com.roundtriptime.roundtrip`

따라서 Apple Developer, Google/Kakao OAuth, push, share intent 설정도 위 단일 앱 ID 기준으로 등록한다. 나중에 별도 테스트 앱이 필요해지면 `.dev` 식별자를 추가한다.

## 3. 언제 EAS build를 다시 하나

다시 빌드해야 하는 변경:

- native package 설치/삭제
- `app.config.ts` plugin, 권한, scheme, bundle/package 설정 변경
- Google/Kakao native SDK 설정 변경
- push notification, background fetch, share intent/share extension 설정 변경
- iOS/Android native capability 변경

다시 빌드하지 않아도 되는 변경:

- TS/TSX 화면 수정
- API hook, Zustand, TanStack Query 로직 수정
- theme/style/UI 수정
- 문서 수정

대부분의 앱 코드 변경은 `npm run start:dev`와 앱 reload로 확인한다.

## 4. 환경 모드

`APP_ENV`는 `.env`에서만 바꾼다.

- `development`: API mock ON, 개발 화면명 overlay ON
- `preview`: API mock ON, 개발 화면명 overlay OFF
- `production`: API mock OFF, 실제 API 호출

협업 개발의 기본값은 `APP_ENV=production`이다. mock 기반 화면 개발은 중단하고, 필요한 경우에만 로컬 디버깅 목적으로 `development`를 사용한다.

## 5. 최소 확인 명령

작업 후 아래 명령은 기본으로 확인한다.

```bash
npm run typecheck
npm run lint
```

커밋 시 Husky/lint-staged가 staged 파일에 대해 ESLint와 Prettier를 자동 실행한다.

## 6. 먼저 읽을 문서

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

## 7. 현재 개발 우선순위

시연용 mock 개발보다 실제 dev build 개발 환경을 우선한다.

1. Dev build 개발 환경 고정
2. 인증 / 세션 안정화
3. 공유 시트 / URL 수신
4. 백그라운드 fetch polling, push notification
5. 지도 SDK
6. 플랜 마켓 고도화 및 요구사항 문서화
7. UI/UX 리팩토링

## 8. 주의할 점

- `.env`는 커밋하지 않는다.
- `.env.example`에는 실제 secret을 넣지 않는다.
- `EXPO_PUBLIC_*` 값은 클라이언트 번들에 포함된다.
- Expo Go는 표준 개발 환경이 아니다. native module 오류가 Expo Go에서 발생하면 dev build에서 재현 여부를 먼저 확인한다.
- `docs/`는 이제 협업 컨텍스트로 추적한다. 문서 수정이 코드 계약을 바꾸는 경우 관련 코드도 같이 확인한다.
