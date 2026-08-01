# Supported Platforms

> 본 문서는 RoundTrip 모바일 앱이 **공식 지원하는 iOS / Android OS 버전** 을 정의한다. 하드웨어 폼팩터(태블릿·폴더블), 웹 지원 범위도 포함한다.

## 정의 목적

1. 개발 시 호환성 테스트 범위를 한정한다 (시뮬레이터 매트릭스 / E2E 시나리오 OS 매트릭스).
2. EAS Build / Xcode / Gradle 의 minimum/target 값과 일치시켜 빌드 산출물이 의도된 디바이스에서만 설치되도록 한다.
3. 스토어 등록 시점에 정확한 OS 요구사항을 표기한다.
4. SDK 메이저 업그레이드 시 재검토 기준점을 제공한다.

## iOS

| 항목 | 값 | 비고 |
| --- | --- | --- |
| **최소 지원 (Deployment Target)** | **iOS 15.1** | Expo SDK 54 기본값. 변경 시 EAS Build 의 iOS deployment target override 필요 |
| 권장 / 주력 | iOS 17, iOS 18 | 시뮬레이터 정기 검증 대상 |
| 디바이스 | iPhone 전용 (iPad 미지원) | `app.json` 의 `ios.supportsTablet: false` 로 명시 |
| 아키텍처 | arm64 | 시뮬레이터는 Apple Silicon (arm64) 우선 |

**근거**
- Expo SDK 54 의 iOS 최소 지원이 15.1 이며, Tech Stack 결정과 정확히 일치.
- 2026-05 시점 iOS 16+ 가 활성 디바이스의 93%+, iOS 15 까지 포함 시 99%+ 커버리지로 추정.
- iPhone 6s / 7 / 8 / X 사용자(iOS 15에서 동결)를 최소 비용으로 흡수.
- 더 높은 minimum 으로 올릴 실익이 적다.

## Android

| 항목 | 값 | API Level | 비고 |
| --- | --- | --- | --- |
| **minSdk (최소 지원)** | **Android 7.0 (Nougat)** | **24** | Expo SDK 54 기본값 |
| **targetSdk** | **Android 15** | **35** | Google Play 정책 (2026년 신규/업데이트 앱 요구사항) |
| **compileSdk** | **Android 15** | **35** | targetSdk 와 동일 권장 |
| ABI | arm64-v8a, armeabi-v7a | — | 32비트는 호환성용 최소 포함 |

**근거**
- minSdk 24 는 Expo SDK 54 의 기본값. 글로벌 활성 디바이스의 약 98% 커버.
- targetSdk 35 는 Google Play 가 2026년 신규/업데이트 앱에 요구하는 최소 타겟. 미준수 시 등록 거부.
- 한국 / 일본 / 동남아 시장에서 Android 7.0 미만 점유율은 무의미한 수준.

## 폼팩터

| 폼팩터 | MVP | 비고 |
| --- | --- | --- |
| iPhone | ✅ | 주력 |
| iPad | ❌ | 추후 검토 |
| Android 핸드셋 | ✅ | 주력 |
| Android 태블릿 | ❌ | 추후 검토 |
| Foldable / Flip | ❌ | 추후 검토 |
| Apple Watch / Wear OS | ❌ | 범위 외 |

> 화면 회전: 세로 고정 (`orientation: portrait`). PRD/Feature specs 상의 모바일 우선 원칙에 따름.

## 웹

| 항목 | 값 |
| --- | --- |
| MVP | ❌ 미지원 |
| Phase 3 이후 | ✅ 일정 조회 / 편집 / 공유 한정 (장소 추출 기능 제외) |
| 브라우저 타겟 | 결정 보류 (Phase 3 진입 시 별도 정의) |

## 빌드 매핑 (참조)

각 값이 코드 / 설정 어디에 들어가는지:

- iOS deployment target → `ios/<App>.xcworkspace` (prebuild 후) 또는 `expo-build-properties` 플러그인의 `ios.deploymentTarget`
- Android minSdk / targetSdk / compileSdk → `expo-build-properties` 플러그인의 `android.minSdkVersion / targetSdkVersion / compileSdkVersion`
- 둘 다 `app.config.ts` 의 plugins 섹션에서 한 군데 관리

## 시뮬레이터 / 기기 검증 매트릭스

| 우선순위 | 환경 | 비고 |
| --- | --- | --- |
| 필수 | iOS Simulator (현 SDK 기본 버전) | 일상 개발 |
| 필수 | Android Emulator (API 35) | 일상 개발 |
| 정기 | 실기기 iPhone (구버전 1대 + 신버전 1대) | 회귀 검증 |
| 정기 | 실기기 Android (Galaxy + 중저가 1종) | 다양성 검증 |
| 출시 전 | iOS 15.1 시뮬레이터 / Android 7.0 에뮬레이터 | 최소 지원 회귀 |

## 검토 주기

- **Expo SDK 메이저 업그레이드 시점** 에 본 문서를 재검토한다 (Expo가 minimum 을 올리는 경우 자동 반영).
- **Google Play targetSdk 정책 변경 발표 시점** 에 Android targetSdk 를 갱신한다.
- 6개월에 한 번 시장 점유율 데이터를 확인해 minimum 상향 여부를 판단한다.

## 결정 이력

| 날짜 | 결정 | 사유 |
| --- | --- | --- |
| 2026-05-06 | iOS 15.1 / Android 7.0 (API 24) / target API 35 로 초기 결정 | Expo SDK 54 기본값 채택, Google Play 2026 정책 충족 |
