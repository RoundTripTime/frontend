> API 성공 응답 표준 코드 체계. 현재 API spec은 HTTP 상태 코드(200/201/204)만 사용하며 성공 코드 문자열이 없다. 이 문서는 클라이언트의 일관된 성공 처리·로깅·다국어 메시지 매핑을 위해 신규 SuccessCode 체계를 제안한다.
> 

## 1. 설계 원칙

- HTTP 상태 코드는 그대로 유지한다. SuccessCode는 이를 **대체하지 않고 보강**한다.
- 성공 응답 body는 기존 spec 그대로 둔다. SuccessCode는 응답 메타 또는 HTTP 헤더로 전달하는 것을 권장한다 (도입 단계에서는 클라이언트 내부 매핑만으로도 사용 가능).
- 코드 명명 규칙: `<도메인>_<행위>_<결과>` 형태의 SCREAMING_SNAKE_CASE.
- 행위 접미사 표준: `FETCHED`(조회), `CREATED`(생성), `UPDATED`(수정), `DELETED`(삭제), `PROCESSED`(상태 처리/전이).
- 모든 SuccessCode는 안정적인 HTTP 상태와 1:1 또는 N:1로 대응한다.

## 2. 권장 응답 형식

도입 시 성공 응답에 `meta` 객체를 추가하는 방식을 권장한다. 기존 데이터 필드는 그대로 유지된다.

```json
{
  "meta": {
    "code": "AUTH_LOGIN_SUCCESS",
    "message": "로그인에 성공했습니다."
  },
  "data": {
    "access_token": "eyJhbGci..."
  }
}
```

204 No Content 응답은 body가 없으므로 SuccessCode를 `X-Success-Code` 응답 헤더로 전달한다.

## 3. 공통 성공 코드

개별 엔드포인트 코드 대신 범용으로 쓸 수 있는 폴백 코드. 신규 엔드포인트 추가 시 우선 사용 가능하다.

| code | HTTP | 설명 |
| --- | --- | --- |
| RESOURCE_FETCHED | 200 | 리소스 조회 성공 |
| RESOURCE_CREATED | 201 | 리소스 생성 성공 |
| RESOURCE_UPDATED | 200 | 리소스 수정 성공 |
| RESOURCE_DELETED | 204 | 리소스 삭제 성공 |

---

## 4. 도메인별 성공 코드

API spec 64개 엔드포인트 전수 매핑. 각 엔드포인트는 정확히 하나의 SuccessCode를 가진다.

### 4.1 인증 (Auth)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| POST /auth/social | 201 | AUTH_LOGIN_SUCCESS | 소셜 로그인/가입 성공 |
| POST /auth/refresh | 200 | AUTH_TOKEN_REFRESHED | 액세스 토큰 갱신 성공 |
| DELETE /auth/session | 204 | AUTH_LOGOUT_SUCCESS | 로그아웃 성공 |

> `AUTH_LOGIN_SUCCESS` 응답 시 `user.is_new_user`가 true이면 클라이언트는 온보딩 화면으로 분기한다.
> 

### 4.2 사용자 (Users)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /users/me | 200 | USER_PROFILE_FETCHED | 내 프로필 조회 성공 |
| PATCH /users/me | 200 | USER_PROFILE_UPDATED | 프로필 수정 성공 |
| DELETE /users/me | 204 | USER_ACCOUNT_DELETED | 계정 삭제 성공 |
| GET /users/:user_id/profile | 200 | USER_PUBLIC_PROFILE_FETCHED | 다른 사용자 프로필 조회 성공 |
| POST /users/:user_id/follow | 201 | USER_FOLLOW_CREATED | 팔로우 성공 |
| DELETE /users/:user_id/follow | 204 | USER_UNFOLLOW_SUCCESS | 언팔로우 성공 |

### 4.3 링크 수집 (Source Links)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| POST /source-links | 201 | SOURCE_LINK_SUBMITTED | 링크 제출 및 분석 잡 생성 성공 |
| GET /source-links | 200 | SOURCE_LINK_LIST_FETCHED | 링크 목록 조회 성공 |

> `SOURCE_LINK_SUBMITTED` 시 `job_status`는 항상 pending이며, 클라이언트는 반환된 `job_id`로 `/jobs/:job_id` 폴링을 시작한다.
> 

### 4.4 분석 잡 (Extraction Jobs)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /jobs/:job_id | 200 | JOB_STATUS_FETCHED | 분석 잡 상태 조회 성공 |

> 이 코드는 HTTP 요청 자체의 성공만 의미한다. `job_status` 필드값(pending / processing / done / failed)은 별개이며, failed인 경우에도 HTTP는 200이고 코드는 `JOB_STATUS_FETCHED`이다. 실패 원인은 응답 body의 `error_code` 필드를 참조한다.
> 

### 4.5 장소 후보 (Place Candidates)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /jobs/:job_id/candidates | 200 | CANDIDATE_LIST_FETCHED | 장소 후보 목록 조회 성공 |
| PATCH /candidates/:candidate_id | 200 | CANDIDATE_UPDATED | 후보 단건 수락/거절/수정 성공 |
| POST /candidates/batch | 200 | CANDIDATE_BATCH_PROCESSED | 후보 일괄 처리 성공 |

> `CANDIDATE_BATCH_PROCESSED`는 부분 실패를 포함한 처리 완료를 의미한다. 일부 항목이 실패해도 HTTP 200이며, 클라이언트는 응답 body의 `failed` 배열을 반드시 확인해야 한다. `failed` 배열이 비어있지 않으면 사용자에게 부분 실패를 안내한다.
> 

### 4.6 장소 (Places)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /places/:place_id | 200 | PLACE_FETCHED | 장소 상세 조회 성공 |
| GET /places/search | 200 | PLACE_SEARCH_FETCHED | 장소 검색 성공 |
| GET /places/similar | 200 | PLACE_SIMILAR_FETCHED | 유사 장소 추천 조회 성공 |
| GET /discover | 200 | PLACE_DISCOVER_FETCHED | 둘러보기 취향 기반 추천 조회 성공 |
| GET /places/:place_id/source-links | 200 | PLACE_SOURCE_LINK_LIST_FETCHED | 장소 출처 영상 목록 조회 성공 |

> `PLACE_SEARCH_FETCHED` / `PLACE_SIMILAR_FETCHED` / `PLACE_DISCOVER_FETCHED`는 결과 배열이 비어 있어도(0건) 성공으로 간주한다. 콜드 스타트 fallback 적용 여부와 무관하게 동일 코드를 사용한다.
> 

### 4.7 장소 리뷰 (Place Reviews)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /places/:place_id/reviews | 200 | REVIEW_LIST_FETCHED | 장소 리뷰 목록 조회 성공 |
| POST /places/:place_id/reviews | 201 | REVIEW_CREATED | 리뷰 작성 성공 |
| DELETE /places/:place_id/reviews/:review_id | 204 | REVIEW_DELETED | 리뷰 삭제 성공 |

### 4.8 플레이스 (Collections)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /collections | 200 | COLLECTION_LIST_FETCHED | 플레이스 목록 조회 성공 |
| POST /collections | 201 | COLLECTION_CREATED | 플레이스 생성 성공 |
| PATCH /collections/:collection_id | 200 | COLLECTION_UPDATED | 플레이스 수정 성공 |
| DELETE /collections/:collection_id | 204 | COLLECTION_DELETED | 플레이스 삭제 성공 |
| GET /collections/:collection_id/places | 200 | COLLECTION_PLACE_LIST_FETCHED | 플레이스 내 장소 목록 조회 성공 |
| POST /collections/:collection_id/places | 201 | COLLECTION_PLACE_ADDED | 플레이스에 장소 추가 성공 |
| DELETE /collections/:collection_id/places/:place_id | 204 | COLLECTION_PLACE_REMOVED | 플레이스에서 장소 제거 성공 |
| GET /collections/:collection_id/share 🔓 | 200 | COLLECTION_SHARE_FETCHED | 플레이스 공유 링크 조회 성공 |

### 4.9 플랜 (Itineraries)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /itineraries | 200 | ITINERARY_LIST_FETCHED | 플랜 목록 조회 성공 |
| POST /itineraries | 201 | ITINERARY_CREATED | 플랜 생성 성공 |
| GET /itineraries/:itinerary_id | 200 | ITINERARY_FETCHED | 플랜 상세 조회 성공 |
| PATCH /itineraries/:itinerary_id | 200 | ITINERARY_UPDATED | 플랜 기본 정보 수정 성공 |
| DELETE /itineraries/:itinerary_id | 204 | ITINERARY_DELETED | 플랜 삭제 성공 |
| POST /itineraries/:itinerary_id/items | 201 | ITINERARY_ITEM_ADDED | 플랜에 장소 추가 성공 |
| PATCH /itineraries/:itinerary_id/items/:item_id | 200 | ITINERARY_ITEM_UPDATED | 장소 일정 수정 성공 |
| DELETE /itineraries/:itinerary_id/items/:item_id | 204 | ITINERARY_ITEM_REMOVED | 플랜에서 장소 제거 성공 |
| POST /itineraries/:itinerary_id/items/reorder | 200 | ITINERARY_ITEM_REORDERED | 일정 순서 일괄 변경 성공 |
| GET /itineraries/:itinerary_id/share 🔓 | 200 | ITINERARY_SHARE_FETCHED | 플랜 공유 링크 조회 성공 |
| GET /itineraries/:itinerary_id/ota-links | 200 | ITINERARY_OTA_LINK_GENERATED | OTA 예약 링크 생성 성공 |

### 4.10 Planning Agent

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| POST /itineraries/:itinerary_id/agent | 200 | AGENT_MESSAGE_PROCESSED | Agent 메시지 처리 및 Tool 실행 완료 |

> `AGENT_MESSAGE_PROCESSED` 응답의 `itinerary_updated`가 true이면 클라이언트는 `GET /itineraries/:itinerary_id`를 재호출해 플랜을 갱신한다.
> 

### 4.11 커뮤니티 (Community)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /community/posts | 200 | POST_LIST_FETCHED | 커뮤니티 피드 조회 성공 |
| POST /community/posts | 201 | POST_CREATED | 포스트 작성 성공 |
| GET /community/posts/:post_id | 200 | POST_FETCHED | 포스트 상세 조회 성공 |
| DELETE /community/posts/:post_id | 204 | POST_DELETED | 포스트 삭제 성공 |
| POST /community/posts/:post_id/like | 201 | POST_LIKE_CREATED | 포스트 좋아요 성공 |
| DELETE /community/posts/:post_id/like | 200 | POST_LIKE_REMOVED | 포스트 좋아요 취소 성공 |
| GET /community/posts/:post_id/comments | 200 | COMMENT_LIST_FETCHED | 댓글 목록 조회 성공 |
| POST /community/posts/:post_id/comments | 201 | COMMENT_CREATED | 댓글 작성 성공 |
| DELETE /community/posts/:post_id/comments/:comment_id | 204 | COMMENT_DELETED | 댓글 삭제 성공 |

> `POST_LIKE_REMOVED`는 좋아요 취소이며 HTTP 200(body에 `like_count` 반환)이다. 좋아요 등록(`POST_LIKE_CREATED`)은 새 리소스 생성이므로 201을 사용한다 — 비대칭에 주의.
> 

### 4.12 플랜 마켓 (Plan Market)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /market/plans | 200 | MARKET_PLAN_LIST_FETCHED | 플랜 마켓 목록 조회 성공 |
| POST /market/plans | 201 | MARKET_PLAN_LISTED | 플랜 마켓 등록 성공 |
| GET /market/plans/:market_plan_id/preview | 200 | MARKET_PLAN_PREVIEW_FETCHED | 플랜 마켓 미리보기 조회 성공 (크레딧 차감 없음) |
| GET /market/plans/:market_plan_id | 200 | MARKET_PLAN_FETCHED | 플랜 마켓 상세 조회 성공 (최초 조회 시 크레딧 1개 차감) |
| DELETE /market/plans/:market_plan_id | 204 | MARKET_PLAN_UNLISTED | 플랜 마켓 등록 취소 성공 |

> `MARKET_PLAN_FETCHED`는 크레딧 차감이 동반될 수 있다. `is_purchased`가 false인 사용자의 최초 조회 시 크레딧 1개가 차감되고, 이미 구매한 경우 차감 없이 동일 코드로 반환된다. 차감 실패(크레딧 부족)는 성공이 아니라 `INSUFFICIENT_CREDITS`(402) 에러로 처리된다.
> 

### 4.13 크레딧 / 광고 (Credits)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /credits/me | 200 | CREDIT_BALANCE_FETCHED | 내 크레딧 잔액 조회 성공 |
| GET /credits/me/history | 200 | CREDIT_HISTORY_FETCHED | 크레딧 적립/차감 내역 조회 성공 |
| POST /credits/ads/start | 201 | AD_SESSION_STARTED | 광고 시청 세션 시작 성공 |
| POST /credits/ads/complete | 200 | AD_VIEW_COMPLETED | 광고 시청 완료 처리 성공 |

> `AD_VIEW_COMPLETED` 응답의 `credit_earned`가 true이면 이번 완료로 크레딧 1개가 적립된 것이다. 클라이언트는 `balance` 값으로 잔액 UI를 갱신한다. `credit_earned`가 false여도 시청 자체는 정상 처리된 것이므로 동일 코드를 사용한다.
> 

### 4.14 알림 (Notifications)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /notifications | 200 | NOTIFICATION_LIST_FETCHED | 알림 목록 조회 성공 |
| PATCH /notifications/:notification_id/read | 200 | NOTIFICATION_READ | 알림 읽음 처리 성공 |

### 4.15 공개 공유 (Public Share)

| 엔드포인트 | HTTP | code | 설명 |
| --- | --- | --- | --- |
| GET /public/itineraries/:share_token 🔓 | 200 | PUBLIC_ITINERARY_FETCHED | 공유 플랜 조회 성공 (비인증) |
| GET /public/collections/:share_token 🔓 | 200 | PUBLIC_COLLECTION_FETCHED | 공유 플레이스 조회 성공 (비인증) |

---

## 5. HTTP 상태 코드 운용 기준

| HTTP | 사용 시점 | body |
| --- | --- | --- |
| 200 OK | 조회 / 수정 / 상태 처리 성공 | 있음 |
| 201 Created | 새 리소스 생성 성공 (가입, 제출, 작성, 좋아요 등록 등) | 있음 |
| 204 No Content | 삭제 / 로그아웃 등 반환 데이터가 없는 성공 | 없음 — SuccessCode는 헤더로 전달 |

## 6. 비고

- 총 64개 엔드포인트에 대응하는 SuccessCode 64종 + 공통 폴백 4종을 정의했다.
- 본 체계 도입은 선택 사항이며, 우선 클라이언트 내부 매핑 테이블로만 적용한 뒤 서버 응답 `meta` 필드 추가는 점진 도입할 수 있다.
- 에러 응답은 별도 문서 ErrorCode를 참조한다.