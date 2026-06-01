# 아키텍처 패턴

## 선택

**Feature-based**

## 근거

### 1. 화면 흐름이 Feature 단위로 분기된다

`Screen Flow.md` 의 최상위 분기는 탭 = Feature 단위로 나뉜다.

- 홈 탭 / 플레이스 탭 / 플랜 탭 / 커뮤니티 탭 / 마이페이지

각 탭의 하위 흐름(링크 수집, 플레이스, 플랜, 커뮤니티, 알림, 공개 공유)은 서로 독립된 그래프로 그려져 있고, Feature 경계를 넘는 전이는 명시적인 진입점(공유 링크, 태그)으로 제한된다.

### 2. 같은 Feature 내 화면 응집도가 높다

`Screen Specs.md` 의 ID 네이밍이 Feature 응집을 반영한다.

- 플랜 마켓: `S-11M`, `S-11MP`, `S-11MAD`, `S-11MR` — 목록·상세·광고·등록이 한 Feature 안에 묶인다.
- 커뮤니티: `S-11`, `S-11A` — 피드와 포스트 상세가 한 Feature.
- 플랜: `S-06`, `S-06N`, `S-07`, `S-07-M`, `S-08`, `S-09` — 목록·생성·편집·지도·Agent·공유.

Feature-based 는 이 응집을 디렉터리로 그대로 표현한다. Layer-based 는 같은 Feature 변경이 여러 layer 에 흩어진다.

### 3. Feature 단위로 독립 API·상태를 가진다

`Screen Specs.md` 동작 명세에서 호출되는 엔드포인트가 Feature 별로 분리되어 있다.

- 플랜: `POST /itineraries`
- 커뮤니티: `GET /community/posts`, `POST /community/posts/:id/like`, `POST /community/posts/:id/comments`
- 마켓: `GET /market/plans`, `GET /market/plans/:id/preview`, `POST /market/plans`
- 크레딧/광고: `POST /credits/ads/start`, `POST /credits/ads/complete`
- 둘러보기: `GET /discover`
- 팔로우: `POST /users/:user_id/follow`

API 경계가 Feature 경계와 일치하므로, Feature 폴더 단위로 데이터·상태를 묶을 때 의존성이 끊긴다.

### 4. Feature 단위 확장이 잦다

`Screen Flow.md` 와 `Screen Specs.md` 에 이미 후속 확장 단서가 명시되어 있다.

- 플랜 마켓의 광고 시청·크레딧 충전(`S-11MAD`)은 별도 Feature 로 합류된 케이스
- OTA 예약은 액티비티 등으로 확장 예정 (Phase 이후)
- Planning Agent(`S-08`) 는 플랜 Feature 내부 서브 Feature

새 Feature 추가가 기존 Feature 폴더에 영향을 주지 않는 구조가 필요하다.

### 5. Feature 간 결합은 좁고 명시적이다

Feature 경계를 넘는 동작은 진입점이 한정되어 있다.

- 커뮤니티 포스트의 태그 → `S-05` 장소 상세 / `S-09` 플랜 공유
- 플랜 마켓 상세의 "내 플랜으로 복사하기" → `S-07` 플랜 편집
- 홈 토스트 / 푸시 알림 → `S-04` 최근 추가한 장소

Feature 간 통신은 라우팅 + 공용 도메인 모델(장소, 플랜) 만으로 충분하다. 공유 layer 는 최소화 가능하다.

## 결론

화면 흐름·화면 명세 모두 Feature 경계가 뚜렷하고, API·상태·확장 단위가 Feature 와 일치한다. Feature-based 를 채택한다.

## 현재 적용 구조

Expo Router의 파일 기반 라우팅은 `app/`에 둔다. `app/`의 각 화면 파일은 라우팅 진입점과 화면 조립을 담당하고, 복잡한 상태·이벤트·데이터 가공은 `src/features/<feature>/`로 분리한다.

서버 통신은 화면이나 feature 내부에 직접 흩어두지 않고 `src/api/`에 도메인별로 모은다. API 훅은 `src/api/<domain>/hooks.ts`에서 관리하며, Query Key는 `src/lib/queryClient.ts`의 `queryKeys`를 기준으로 통일한다.

공용 UI와 런타임 유틸은 feature에 종속되지 않는 경우에만 `src/components/`, `src/lib/`, `src/stores/`, `src/theme/`에 둔다. 특정 화면·도메인에만 쓰이는 UI, controller hook, view model은 해당 feature 디렉터리 안에 둔다.

즉 현재 구조는 `app/` 라우트 + `src/api/` 통신 레이어 + `src/features/` 도메인 구현을 결합한 Feature 중심 하이브리드 구조다.
