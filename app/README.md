# App Route Guide

`app/`는 Expo Router의 route 계층이다. 화면 파일은 가능한 얇게 유지하고, API 호출/뷰 모델/비즈니스 계산은 `src/`로 분리한다.

## 주요 그룹

- `(auth)`: 로그인 전 화면
- `(tabs)`: 로그인 후 하단 탭
- `(share)`: 앱 내부 URL 제출 및 공유 수신 디버깅 화면
- `places`: 장소 후보/상세
- `plans`: 플랜 생성/상세/보류 route
- `community`: 커뮤니티와 플랜 마켓
- `settings`: 설정 하위 stack

## 화면 번호

개발 모드에서는 `DevScreenOverlay`가 현재 화면 번호와 이름을 표시한다. 화면 번호는 `docs/TDD/Screen Specs.md`와 `docs/TDD/Screen Flow.md`를 기준으로 맞춘다.

## 구현 원칙

- 화면 파일에는 route params, 화면 상태, 렌더링 조립만 둔다.
- API hook은 `src/api/<domain>/hooks.ts`를 사용한다.
- 화면용 데이터 가공은 `src/features/<domain>/viewModel.ts` 또는 별도 model 파일로 둔다.
- 공통 UI는 `src/components`에 둔다.
- native header title이 UX에 맞지 않으면 `app/_layout.tsx`에서 `headerShown: false`로 처리한다.

## 현재 보류 route

아래 route는 파일은 있으나 진입 UI가 제한적이거나 기능이 보류 상태다.

- `plans/[planId]/map`
- `plans/[planId]/agent`
- `plans/[planId]/share`
- `community/market/register`
- `community/market/[marketPlanId]/credits`

삭제 전에 `docs/TDD/Screen Flow.md`와 실제 기획 상태를 확인한다.
