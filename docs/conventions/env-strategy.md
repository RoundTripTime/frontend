# 환경 변수 전략

> 본 문서는 RoundTrip 프론트엔드의 환경 변수 관리 방식을 정의한다.

## 3계층 구조

```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1 · 로컬 개발                                             │
│    .env (gitignore) ← .env.example (committed) 보고 채움         │
│    EXPO_PUBLIC_* 는 client 번들에 인라인                         │
│    APP_ENV=development                                           │
├──────────────────────────────────────────────────────────────────┤
│  Layer 2 · 빌드 시점 (eas.json profile + EAS Secrets)            │
│    .env 파일 사용 X. 모든 값은 EAS 가 주입.                      │
│    APP_ENV={development|preview|production}                      │
├──────────────────────────────────────────────────────────────────┤
│  Layer 3 · 런타임 (앱 안에서 접근)                               │
│    클라이언트 키 → process.env.EXPO_PUBLIC_*                     │
│    파생 / 빌드 메타 → Constants.expoConfig.extra.*               │
└──────────────────────────────────────────────────────────────────┘
```

## 변수 분류 규칙

| 카테고리 | 접두 | 노출 시점 | 예시 |
| --- | --- | --- | --- |
| **클라이언트 안전 키** | `EXPO_PUBLIC_*` | 빌드 시 번들에 인라인, 런타임에서 `process.env` 로 읽기 | `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **빌드 시점 전용** | 접두 없음 | `app.config.ts` 안에서만 `process.env.X` 로 읽기. 번들에 미포함 | `APP_ENV`, `GOOGLE_ADMOB_IOS_APP_ID` (plugin 인자) |
| **파생 / 메타** | (env 아님) | `app.config.ts` 의 `extra` 에서 계산 후 expo-constants 로 접근 | `appEnv`, `eas.projectId` |

> "client 안전" 의 기준: 디컴파일·네트워크 캡처로 추출 가능. 즉 **앱에 들어가는 순간 비밀이 아니다.** 따라서 `EXPO_PUBLIC_*` 에는 IP 제한·번들 ID 제한이 걸려있는 키만 둔다. 백엔드 비밀(서비스 계정 키, DB 비밀번호 등)은 절대 두지 않는다.

## 파일 / 위치

| 파일 | 용도 | git |
| --- | --- | --- |
| `.env.example` | 필요한 키 목록의 템플릿. 실제 값 X | committed |
| `.env` | 로컬 개발용 실제 값 | gitignored |
| `.env.local`, `.env.development.local` | 개인별 오버라이드 | gitignored |
| EAS Secrets | preview/production 빌드 시 주입 | EAS 서버 |

> Expo SDK 50+ 는 `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local` 을 자동 로드한다 (Vite 와 동일 우선순위).

## EAS Secrets 사용 (WF-17 진입 시)

eas.json 빌드 프로필에서 다음 둘 중 하나로 비밀 값 주입:

```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production",
        "EXPO_PUBLIC_API_BASE_URL": "https://api.roundtrip.example.com/v1"
      }
    }
  }
}
```

또는 `eas secret:create` 로 등록 후 자동 주입:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_MAPS_API_KEY --value <키>
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value <DSN>
```

> 등록된 시크릿은 빌드 환경에 자동 주입된다. `eas.json` 에 평문으로 적지 않는다.

## 사용 패턴 (런타임)

```ts
// 1. EXPO_PUBLIC_* — 직접 접근
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// 2. extra — expo-constants 경유
import Constants from 'expo-constants';
const appEnv = Constants.expoConfig?.extra?.appEnv;
```

타입 안전을 위해 WF-07 진입 시 `src/lib/env.ts` 같은 단일 진입점을 만들어 모든 접근을 캡슐화할 예정 (현 시점엔 미작성).

## 주의사항

- **절대 EXPO_PUBLIC_* 에 백엔드 비밀을 넣지 않는다.** (인앱에서 추출 가능)
- 키 회전 시 모든 빌드 다시 (구버전 앱은 옛 키를 박고 있음)
- AdMob `app_id` 는 `EXPO_PUBLIC_*` 가 아니라 plugin 인자로 빌드 시점에 들어간다. `.env.example` 의 접두 없는 항목 참조.
- iOS / Android 별로 다른 OAuth client ID 를 발급받아야 한다 (같은 키를 양쪽에 쓰지 말 것).

## 결정 이력

| 날짜 | 결정 | 사유 |
| --- | --- | --- |
| 2026-05-06 | 3계층 구조 (`.env` / EAS Secrets / extra) 확정 | Expo SDK 54 표준 + 비밀 분리 원칙 |
| 2026-05-06 | `extra.appEnv` 만 우선 노출 | 다른 변수는 해당 WF 진입 시 추가 |
